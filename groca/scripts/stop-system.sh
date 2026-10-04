#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

print_ok "Stopping Groca system"
stop_pid_file client
stop_pid_file server

# Fallback: ensure known ports are clear
kill_port "$CLIENT_PORT"
kill_port "$SERVER_PORT"

docker_down
show_status
