#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

node "$SCRIPT_DIR/update-website.js" "$@"

for arg in "$@"; do
  if [[ "$arg" == "--dry-run" || "$arg" == "-n" ]]; then
    exit 0
  fi
done

(cd "$PROJECT_ROOT" && npm run build)
