#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PIDS_DIR="$SCRIPT_DIR/.pids"
LOGS_DIR="$SCRIPT_DIR/logs"

SERVER_PORT="${SERVER_PORT:-5000}"
CLIENT_PORT="${CLIENT_PORT:-5173}"
DB_PORT="${DB_PORT:-5432}"

mkdir -p "$PIDS_DIR" "$LOGS_DIR"

color_green='\033[0;32m'
color_yellow='\033[1;33m'
color_red='\033[0;31m'
color_reset='\033[0m'

print_ok() { echo -e "${color_green}[OK]${color_reset} $*"; }
print_warn() { echo -e "${color_yellow}[WARN]${color_reset} $*"; }
print_err() { echo -e "${color_red}[ERROR]${color_reset} $*"; }

pid_file_for() {
  local service="$1"
  echo "$PIDS_DIR/${service}.pid"
}

is_pid_running() {
  local pid="$1"
  kill -0 "$pid" >/dev/null 2>&1
}

port_pid() {
  local port="$1"
  lsof -tiTCP:"$port" -sTCP:LISTEN 2>/dev/null | head -n 1 || true
}

is_port_open() {
  local port="$1"
  [[ -n "$(port_pid "$port")" ]]
}

stop_pid_file() {
  local service="$1"
  local pid_file
  pid_file="$(pid_file_for "$service")"

  if [[ -f "$pid_file" ]]; then
    local pid
    pid="$(cat "$pid_file")"
    if is_pid_running "$pid"; then
      kill "$pid" >/dev/null 2>&1 || true
      sleep 1
      if is_pid_running "$pid"; then
        kill -9 "$pid" >/dev/null 2>&1 || true
      fi
      print_ok "Stopped $service (PID $pid)"
    else
      print_warn "$service pid file existed but PID $pid is not running"
    fi
    rm -f "$pid_file"
  else
    print_warn "No pid file for $service"
  fi
}

kill_port() {
  local port="$1"
  local pid
  pid="$(port_pid "$port")"

  if [[ -n "$pid" ]]; then
    kill "$pid" >/dev/null 2>&1 || true
    sleep 1
    if is_pid_running "$pid"; then
      kill -9 "$pid" >/dev/null 2>&1 || true
    fi
    print_ok "Killed process on port $port (PID $pid)"
  else
    print_warn "No process listening on port $port"
  fi
}

wait_for_port() {
  local port="$1"
  local timeout_sec="${2:-25}"

  for ((i = 1; i <= timeout_sec; i += 1)); do
    if is_port_open "$port"; then
      return 0
    fi
    sleep 1
  done

  return 1
}

start_server() {
  if is_port_open "$SERVER_PORT"; then
    print_warn "Server already running on port $SERVER_PORT"
    return 0
  fi

  cd "$PROJECT_ROOT"
  nohup npm run dev --prefix server >"$LOGS_DIR/server.log" 2>&1 &
  local pid=$!
  echo "$pid" >"$(pid_file_for server)"

  if wait_for_port "$SERVER_PORT" 35; then
    print_ok "Server started on port $SERVER_PORT (PID $pid)"
  else
    print_err "Server failed to open port $SERVER_PORT. Check $LOGS_DIR/server.log"
    return 1
  fi
}

start_client() {
  if is_port_open "$CLIENT_PORT"; then
    print_warn "Client already running on port $CLIENT_PORT"
    return 0
  fi

  cd "$PROJECT_ROOT"
  nohup npm run dev --prefix client >"$LOGS_DIR/client.log" 2>&1 &
  local pid=$!
  echo "$pid" >"$(pid_file_for client)"

  if wait_for_port "$CLIENT_PORT" 35; then
    print_ok "Client started on port $CLIENT_PORT (PID $pid)"
  else
    print_err "Client failed to open port $CLIENT_PORT. Check $LOGS_DIR/client.log"
    return 1
  fi
}

docker_up() {
  cd "$PROJECT_ROOT"
  docker compose up -d >/dev/null

  if wait_for_port "$DB_PORT" 30; then
    print_ok "PostgreSQL container ready on port $DB_PORT"
  else
    print_err "PostgreSQL did not open port $DB_PORT"
    return 1
  fi
}

docker_down() {
  cd "$PROJECT_ROOT"
  docker compose down >/dev/null
  print_ok "Docker services stopped"
}

status_line() {
  local label="$1"
  local port="$2"
  local pid
  pid="$(port_pid "$port")"

  if [[ -n "$pid" ]]; then
    printf "%-12s %-10s %-10s\n" "$label" "RUNNING" "PID:$pid"
  else
    printf "%-12s %-10s %-10s\n" "$label" "STOPPED" "-"
  fi
}

show_status() {
  echo "Service      State      Details"
  echo "--------------------------------"
  status_line "Client" "$CLIENT_PORT"
  status_line "Server" "$SERVER_PORT"
  status_line "PostgreSQL" "$DB_PORT"

  echo
  if curl -fsS "http://localhost:${SERVER_PORT}/api/health" >/dev/null 2>&1; then
    print_ok "API health endpoint is reachable"
  else
    print_warn "API health endpoint is not reachable"
  fi

  echo "Logs:"
  echo "  Client -> $LOGS_DIR/client.log"
  echo "  Server -> $LOGS_DIR/server.log"
}
