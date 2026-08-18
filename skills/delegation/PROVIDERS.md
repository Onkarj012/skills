# Provider availability

Use `~/.config/agent-delegation/providers.yaml` as persistent routing state.
Providers omitted from the file are enabled by default.

```yaml
version: 1
timezone: Asia/Kolkata
providers:
  opencode-go:
    state: paused
    reason: monthly usage exhausted
    resume_at: "2026-09-01T00:00:00+05:30"
```

## Effective state

- `enabled`: eligible.
- `disabled`: ineligible until explicitly enabled.
- `paused`: ineligible while `resume_at` is in the future. At or after that
  instant, treat it as enabled and change its persisted state to `enabled`.
- Missing provider: enabled.

Use an ISO 8601 timestamp with an explicit offset for `resume_at`. Preserve
unknown keys and unrelated provider entries when editing the registry.

Conversation-scoped instructions override persistent state for that
conversation only. The latest explicit instruction wins. "Do not use OpenCode
for this task" is temporary; "disable OpenCode" is persistent.

## Controls

Interpret these without requiring a dedicated CLI:

- "Disable `<provider>`" — persist `state: disabled` and a concise reason.
- "Disable `<provider>` until `<time>`" — persist `state: paused` and
  `resume_at`.
- "Enable `<provider>`" — persist `state: enabled` and remove stale pause
  fields.
- "Do not use `<provider>` for this task/conversation" — apply only an
  in-context override.
- "Show delegation providers" — report every explicit registry entry, its
  effective state, pause expiry, and any current conversational overrides.

Provider names describe billing/routing boundaries, not executables.
`opencode-go` controls the OpenCode Go/open-weights catalog only. It does not
disable the OpenCode CLI or unrelated providers invoked through it.
