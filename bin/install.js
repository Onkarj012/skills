#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

const HOME = os.homedir();
const SKILLS_DIR = path.join(__dirname, '..');

// Known agent skill directories
const AGENT_DESTINATIONS = {
  'Claude Code':  path.join(HOME, '.claude', 'skills'),
  'OpenCode':     path.join(HOME, '.opencode', 'skills'),
  'Codex':        path.join(HOME, '.codex', 'skills'),
  'Cursor':       path.join(HOME, '.cursor', 'skills'),
};

const skills = fs.readdirSync(SKILLS_DIR).filter(f => {
  const full = path.join(SKILLS_DIR, f);
  return fs.statSync(full).isDirectory() && f !== 'bin' && !f.startsWith('.');
});

if (skills.length === 0) {
  console.error('No skills found.');
  process.exit(1);
}

const args = process.argv.slice(2);
const targetArg = args.find(a => a.startsWith('--agent='));
const requestedAgent = targetArg ? targetArg.split('=')[1] : null;

// Filter to agents whose config dir exists (or all if --agent= specified)
const targets = Object.entries(AGENT_DESTINATIONS).filter(([name, dir]) => {
  if (requestedAgent) return name.toLowerCase() === requestedAgent.toLowerCase();
  return fs.existsSync(path.dirname(dir)); // parent exists = agent likely installed
});

if (targets.length === 0) {
  console.log('No supported agents detected. Use --agent=<name> to force.');
  console.log('Supported:', Object.keys(AGENT_DESTINATIONS).join(', '));
  process.exit(1);
}

for (const [agentName, destBase] of targets) {
  fs.mkdirSync(destBase, { recursive: true });
  const installed = [];
  for (const skill of skills) {
    const src = path.join(SKILLS_DIR, skill);
    const dest = path.join(destBase, skill);
    fs.mkdirSync(dest, { recursive: true });
    for (const file of fs.readdirSync(src)) {
      fs.copyFileSync(path.join(src, file), path.join(dest, file));
    }
    installed.push(skill);
  }
  console.log(`[${agentName}] Installed ${installed.length} skill(s) → ${destBase}`);
  installed.forEach(s => console.log(`  ✓ ${s}`));
}

console.log('\nRestart your agent to activate.');
