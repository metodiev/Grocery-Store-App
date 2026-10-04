#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

usage() {
  cat <<USAGE
Usage:
  ./scripts/port-manager.sh status [all|client|server|db|<port>]
  ./scripts/port-manager.sh kill <port>
  ./scripts/port-manager.sh start [all|client|server|db]
  ./scripts/port-manager.sh stop [all|client|server|db]
  ./scripts/port-manager.sh restart [all|client|server|db]

Defaults:
  status with no target behaves as status all.
USAGE
}

target_to_port() {
  local target="$1"
  case "$target" in
    client) echo "$CLIENT_PORT" ;;
    server) echo "$SERVER_PORT" ;;
    db) echo "$DB_PORT" ;;
    *) echo "$target" ;;
  esac
}

action="${1:-status}"
target="${2:-all}"

case "$action" in
  status)
    if [[ "$target" == "all" ]]; then
      show_status
      exit 0
    fi
    port="$(target_to_port "$target")"
    if is_port_open "$port"; then
      print_ok "Port $port is LISTENING (PID $(port_pid "$port"))"
    else
      print_warn "Port $port is NOT listening"
    fi
    ;;

  kill)
    if [[ -z "${2:-}" ]]; then
      usage
      exit 1
    fi
    kill_port "$2"
    ;;

  start)
    case "$target" in
      all)
        docker_up
        start_server
        start_client
        ;;
      client)
        start_client
        ;;
      server)
        start_server
        ;;
      db)
        docker_up
        ;;
      *)
        print_err "Unknown target: $target"
        usage
        exit 1
        ;;
    esac
    ;;

  stop)
    case "$target" in
      all)
        stop_pid_file client
        stop_pid_file server
        kill_port "$CLIENT_PORT"
        kill_port "$SERVER_PORT"
        docker_down
        ;;
      client)
        stop_pid_file client
        kill_port "$CLIENT_PORT"
        ;;
      server)
        stop_pid_file server
        kill_port "$SERVER_PORT"
        ;;
      db)
        docker_down
        ;;
      *)
        print_err "Unknown target: $target"
        usage
        exit 1
        ;;
    esac
    ;;

  restart)
    case "$target" in
      all)
        "$SCRIPT_DIR/restart-system.sh"
        ;;
      client)
        stop_pid_file client
        kill_port "$CLIENT_PORT"
        start_client
        ;;
      server)
        stop_pid_file server
        kill_port "$SERVER_PORT"
        start_server
        ;;
      db)
        docker_down
        docker_up
        ;;
      *)
        print_err "Unknown target: $target"
        usage
        exit 1
        ;;
    esac
    ;;

  *)
    usage
    exit 1
    ;;
esac

show_status
