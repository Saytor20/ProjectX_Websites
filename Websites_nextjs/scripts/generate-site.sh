#!/usr/bin/env bash
set -euo pipefail
PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"/Websites_nextjs
TEMPLATE="${1:-modern-restaurant}"
RESTAURANT_FILE="${2:-al_othaim_137466.json}"

cd "$PROJECT_ROOT/templates/_shared"
# Ensure dependencies
npm ci --silent || npm install --silent
cd "$PROJECT_ROOT"
node generator/website-builder.js --template "$TEMPLATE" --restaurant "$RESTAURANT_FILE"

