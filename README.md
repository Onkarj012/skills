# onkar-skills

A curated set of skills for AI coding agents.

`onkar-skills` installs reusable agent workflows into local skill directories for
Claude Code, OpenCode, Codex, and Cursor. The goal is simple: keep high-value
workflows portable, versioned, and easy to reuse across coding agents.

## Included Skills

| Skill | Trigger | Purpose |
| --- | --- | --- |
| `design-directions` | `/design-directions` | Generate five distinct UI directions for a project, each grounded in the product, audience, and stack. |
| `report` | `/report` | Produce a single-file `REPORT.md` by scanning a repository and interviewing the user for missing product context. |

## Supported Agents

The installer targets the standard local skill directory for each supported
agent:

| Agent | Skill directory |
| --- | --- |
| Claude Code | `~/.claude/skills/` |
| OpenCode | `~/.opencode/skills/` |
| Codex | `~/.codex/skills/` |
| Cursor | `~/.cursor/skills/` |

## Installation

There are two supported install flows.

### Quick Install

Use the published package when you want a copy-based install:

```bash
npx onkar-skills
```

The installer detects supported agents by checking for their local configuration
directories, creates any missing `skills/` directories, and copies the skills
into each detected agent.

To install for one agent only:

```bash
npx onkar-skills --agent="Claude Code"
npx onkar-skills --agent=OpenCode
npx onkar-skills --agent=Codex
npx onkar-skills --agent=Cursor
```

The `--agent` value must match one of the supported agent names above, ignoring
case.

### Symlink Install

Use the repository when you want installed skills to stay current with `git
pull`:

```bash
git clone https://github.com/onkarj012/SKILLS.git
cd SKILLS
npm run link
```

This creates symlinks from each agent skill directory back into this repository.
After that, updating the checkout updates the installed skills:

```bash
git pull
```

To list the skills available in the repository:

```bash
npm run list
```

## Updating

For the copy-based install, re-run the package installer:

```bash
npx onkar-skills@latest
```

For the symlink install, update the repository:

```bash
git pull
```

## Uninstalling

Remove a skill by deleting its folder or symlink from the relevant agent
directory. For example:

```bash
rm -rf ~/.claude/skills/design-directions
rm -rf ~/.codex/skills/report
```

Restart the agent after installing, updating, or removing skills.

## Repository Layout

```text
bin/install.js                # copy-based npx installer
scripts/link-skills.sh        # symlink installer for local checkouts
scripts/list-skills.sh        # lists installable skills
skills/<name>/SKILL.md        # skill instructions
```

A skill is installable when it lives at `skills/<name>/SKILL.md`.

## Requirements

- Node.js 16 or newer
- At least one supported agent configuration directory, unless `--agent` is used

## License

MIT
