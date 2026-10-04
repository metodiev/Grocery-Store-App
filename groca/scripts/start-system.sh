#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

print_ok "Starting Groca system (Docker + Server + Client)"
docker_up
start_server
start_client
show_status
