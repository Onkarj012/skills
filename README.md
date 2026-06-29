# onkar-skills

Skills for AI coding agents — Claude Code, OpenCode, Codex, and more.

## Install

### Quick install (copy)

```bash
npx onkar-skills
```

Auto-detects installed agents and copies skills to each.

Force a specific agent:

```bash
npx onkar-skills --agent=claude
npx onkar-skills --agent=opencode
```

### Symlink install (stays up to date)

Clone the repo and symlink the skills into each agent's skill directory. Each
installed skill is a symlink into this repo, so a `git pull` keeps every agent
current — no reinstall needed.

```bash
git clone https://github.com/onkarj012/skills.git
cd skills
npm run link    # or: bash scripts/link-skills.sh
```

Links into `~/.claude/skills`, `~/.opencode/skills`, `~/.codex/skills`, and
`~/.cursor/skills`.

List the skills in this repo:

```bash
npm run list    # or: bash scripts/list-skills.sh
```

## Skills

| Skill | Description |
|-------|-------------|
| `report` | Deep system report — scans repo + interviews you → single `REPORT.md` |
| `design-directions` | Generate 5 contrast-maximal UI mockups for a project |

## Add to Claude Code

After install, restart Claude Code and trigger with:
- `/report` — generate system report
- `/design-directions` — generate UI design directions

## Supported Agents

- Claude Code (`~/.claude/skills/`)
- OpenCode (`~/.opencode/skills/`)
- Codex (`~/.codex/skills/`)
- Cursor (`~/.cursor/skills/`)
