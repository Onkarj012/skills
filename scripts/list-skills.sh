#!/usr/bin/env bash
set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"

cd "$REPO"
find skills -name SKILL.md -not -path '*/node_modules/*' | sed 's|/SKILL.md$||' | sort
