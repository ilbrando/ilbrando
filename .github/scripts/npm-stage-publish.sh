#!/usr/bin/env bash
# pnpm publish delegates the upload to "npm publish". Our npm trusted publishers only allow
# staged publishing, so pnpm is pointed at this script (npm_config_npm_path) which turns
# "npm publish" into "npm stage publish". Everything else is passed through to npm unchanged.
set -euo pipefail

if [ "${1:-}" = "publish" ]; then
  shift
  echo "npm-stage-publish: npm stage publish $*"
  exec npm stage publish "$@"
fi

exec npm "$@"
