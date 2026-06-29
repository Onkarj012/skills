#!/usr/bin/env bash
set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"

cd "$REPO"
find skills -mindepth 2 -maxdepth 2 -type f -name SKILL.md \
  -not -path '*/node_modules/*' \
  | sed 's|/SKILL.md$||' \
  | sort
