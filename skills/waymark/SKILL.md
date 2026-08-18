---
name: waymark
description: Preview, publish, and safely maintain polished HTML artifacts with the waymark CLI. Use when reports, comparisons, tables, status pages, or approved visual plans would be clearer as a hosted page than inline chat.
---

# Waymark

Use the Waymark CLI to prepare, inspect, publish, and maintain a shareable HTML
artifact. The default is themed body-only HTML; raw mode is a narrow path for an
approved generic artifact that genuinely needs a complete custom document.

Read [components](references/components.md) when selecting or writing themed
markup. For a visual plan, first read the
[planning artifact contract](../planning/references/artifact-contract.md); it
owns the plan root, five profiles, canonical copies, metadata, checksums, and
freshness rules.

## Run the Waymark sequence

### 1. Resolve the CLI and remote boundary

Run `command -v waymark`. On Onkar's machine, use
`/Users/onkarj012/Projects/Alternatives/Waymark/bin/waymark` when `waymark` is
not on `PATH`; elsewhere ask where it is installed. Use the resolved executable
for every command.

Offline preview needs no credentials. Before any remote operation, run
`waymark status` and continue only after a successful result containing
`Auth: authenticated`. If authentication is needed, run:

```bash
waymark login --server https://waymark-api.leo4.dev \
  --device-name "<clear device/agent name>"
```

The owner approves the scoped device in a browser. The admin passcode stays out
of chat and local artifacts.

Completion criterion: every command has a resolved executable, and a remote
operation has a successful authenticated status result.

### 2. Compose and inspect the local source

Prepare themed body-only HTML. For a visual plan, use the plan root and profile
from the planning artifact contract and the exact component grammar in
`references/components.md`. Keep semantic source order, visible labels, and
textual equivalents so the page remains understandable without layout or color.

For every local body source intended for publication, create a standalone
preview before requesting publication or update approval:

```bash
waymark preview --title "Quarterly review" \
  --output quarterly-review.html quarterly-review.waymark.html
```

The interface is:

```text
waymark preview --title TITLE --output FILE [--force] <body-file|->
```

Preview is local and deterministic: it does not authenticate, use the network,
open a browser, or publish. It refuses to overwrite an existing output unless
`--force` is supplied. A one-off generic report may use stdin, but preview and
publication must read the same body:

```bash
waymark preview --title "Quarterly review" --output /tmp/quarterly-review.html - < body.html
waymark create --title "Quarterly review" - < body.html
```

Inspect the latest preview for the intended title, section order, navigation
targets, textual equivalents, and clipped or missing content. The body source
has no doctype, full-document tags, `<style>`, or `<script>` elements. Plans
also keep raw mode, plan-supplied scripts and styles, secrets, and invented facts
out of the published page.

Completion criterion: the preview exists for the exact latest body, structural
validation passes, and the inspection covers title, order, navigation,
equivalents, and content visibility.

### 3. Request exact approval

Local creation and review leave remote state unchanged. After the latest preview
and structural verification, ask for approval that names the exact next action:

- create a new page from a named source, with its title and TTL/permanent choice;
- update a named page ID from a named source, with the expected remote
  `updated_at` value and any TTL change;
- perform a separately named downstream action, such as implementation handoff,
  delegation, issue creation, branch work, commits, or a pull request.

For visual plans, the planning skill's state machine applies:

```text
draft -> explicit approval -> publication and/or handoff named in that approval
```

Plan creation never implies approval. Approval authorizes only the separately
listed actions; plan approval does not imply publication or implementation, and
publication approval does not imply later updates. A draft's latest preview is
the review object for any create or update approval.

Completion criterion: the prompt names the exact source, title, action, and
publication settings; an update prompt also names the expected remote timestamp;
no remote mutation occurs before the explicit response.

### 4. Publish the approved artifact

For a themed generic report or approved plan, use the approved source:

```bash
waymark create --title "Quarterly review" --ttl 7 quarterly-review.waymark.html
```

Use `--ttl 0` only for an explicitly permanent page. Put every flag before
positional arguments. The command prints the public URL; verify success and
return that URL. For a maintained page, record the exact page ID, URL, TTL, and
returned `updated_at` beside the local canonical source.

Escape external or user-provided text before insertion; Waymark trusts
publisher HTML and does not sanitize it. Published pages are public to anyone
with the unguessable URL. Include private source material, personal data, or
other non-public information only when the user explicitly intends publication.

Completion criterion: the approved command succeeds, its public URL is
verified and returned, and the local publication record contains the exact
returned metadata.

### 5. Update without overwriting another writer

Waymark updates replace the entire stored body, retain no revision history, and
are last-writer-wins. `get --json` and `list --json` return metadata rather than
stored HTML, so preserve the canonical source locally.

Before requesting update approval, fetch `waymark get --json <id>` and compare
its exact `updated_at` with the known local timestamp. If no timestamp is known,
establish and record the current value before seeking approval. Immediately
before the approved update, fetch again. If the value differs from the approved
expected value, stop: an unexpected remote update timestamp is a hard
publication STOP and reconciliation precedes overwrite.

```bash
waymark update <id> quarterly-review.waymark.html
```

After an update, verify success and record the new `updated_at`. A page is never
deleted automatically.

Completion criterion: the update used the approved source and unchanged remote
timestamp, or the operation stopped with the mismatch documented; a successful
update has its new timestamp recorded.

## Artifact invariants

- Themed mode supplies body content only. Raw mode belongs only to an approved
  generic non-plan artifact that genuinely needs a complete document, custom CSS,
  or JavaScript; inspect its full-document structure separately.
- The documented component class names and structures are the markup grammar.
- Plain headings, paragraphs, lists, links, quotes, code, and tables remain
  valid when a themed component adds no comprehension.
