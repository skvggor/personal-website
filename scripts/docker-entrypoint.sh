#!/bin/sh
set -e

chown -R screenshot:screenshot /app/public

exec su-exec screenshot "$@"