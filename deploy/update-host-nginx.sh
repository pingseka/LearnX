#!/bin/sh
set -eu

cd "$(dirname "$0")/.."

docker compose \
  --env-file .env \
  -f compose.prod.yaml \
  -f compose.host-nginx.yaml \
  up -d --build --remove-orphans frontend backend

docker compose \
  --env-file .env \
  -f compose.prod.yaml \
  -f compose.host-nginx.yaml \
  ps frontend backend

docker image prune -f
