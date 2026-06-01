#!/bin/sh
set -eu

cd "$(dirname "$0")/.."

restore_gateway() {
  docker compose --env-file .env -f compose.prod.yaml up -d gateway
}

trap restore_gateway EXIT

docker compose --env-file .env -f compose.prod.yaml stop gateway
certbot renew
