#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ ! -f .env ]]; then
  if [[ -f .env.example ]]; then
    cp .env.example .env
    echo "Created .env from .env.example." >&2
  else
    echo "Missing .env and .env.example." >&2
    exit 1
  fi
fi

# Fail fast if token not set (empty or missing)
if ! grep -q '^DISCORD_TOKEN=.' .env; then
  echo "DISCORD_TOKEN is missing in .env." >&2
  echo "Open .env, set DISCORD_TOKEN=... then rerun: npm run launch" >&2
  exit 1
fi

npm install
npm run register:commands
npm run start
