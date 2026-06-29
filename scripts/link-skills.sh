#!/usr/bin/env bash
set -euo pipefail

# Links all skills in the repository into the local skill directories used by
# each agent harness:
#   - ~/.claude/skills    — Claude Code
#   - ~/.opencode/skills  — OpenCode
#   - ~/.codex/skills     — Codex
#   - ~/.cursor/skills    — Cursor
# Each entry is a symlink into this repo, so a `git pull` is all that's needed
# to keep installed skills up to date.

REPO="$(cd "$(dirname "$0")/.." && pwd)"
DESTS=("$HOME/.claude/skills" "$HOME/.opencode/skills" "$HOME/.codex/skills" "$HOME/.cursor/skills")

# Collect the repo's skills once, link into every destination.
names=()
srcs=()
while IFS= read -r -d '' skill_md; do
  src="$(dirname "$skill_md")"
  names+=("$(basename "$src")")
  srcs+=("$src")
done < <(find "$REPO/skills" -name SKILL.md -not -path '*/node_modules/*' -not -path '*/deprecated/*' -print0)

if [ "${#names[@]}" -eq 0 ]; then
  echo "No skills found under $REPO/skills" >&2
  exit 1
fi

for DEST in "${DESTS[@]}"; do
  # If $DEST is a symlink that resolves into this repo, we'd end up writing the
  # per-skill symlinks back into the repo's own skills/ tree. Detect and bail
  # out instead of polluting the working copy.
  if [ -L "$DEST" ]; then
    resolved="$(readlink -f "$DEST")"
    case "$resolved" in
      "$REPO"|"$REPO"/*)
        echo "error: $DEST is a symlink into this repo ($resolved)." >&2
        echo "Remove it (rm \"$DEST\") and re-run; the script will recreate it as a real dir." >&2
        exit 1
        ;;
    esac
  fi

  mkdir -p "$DEST"

  for i in "${!names[@]}"; do
    name="${names[$i]}"
    src="${srcs[$i]}"
    target="$DEST/$name"

    if [ -e "$target" ] && [ ! -L "$target" ]; then
      echo "error: refusing to replace existing non-symlink $target" >&2
      exit 1
    fi

    ln -sfn "$src" "$target"
    echo "linked $name -> $src ($DEST)"
  done
done
