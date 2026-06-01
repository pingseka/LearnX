#!/bin/sh
set -eu

cd "$(dirname "$0")/.."

docker compose --env-file .env -f compose.prod.yaml pull
docker compose --env-file .env -f compose.prod.yaml up -d --remove-orphans
docker compose --env-file .env -f compose.prod.yaml ps
