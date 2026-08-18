---
name: waymark
description: Preview, publish, and safely maintain polished HTML artifacts with the waymark CLI. Use when reports, comparisons, tables, status pages, or approved visual plans would be clearer as a hosted page than inline chat.
---

# Waymark

Use the Waymark CLI to prepare, inspect, publish, and maintain a shareable HTML
artifact. Visual plans use themed body-only HTML and Waymark's component grammar.
Generic reports use raw, complete, self-contained HTML so the composing agent
owns their layout, CSS, typography, responsiveness, and print rules.

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

Choose the source contract by artifact type.

For a visual plan, prepare themed body-only HTML using the plan root and profile
from the planning artifact contract and the exact component grammar in
`references/components.md`. Keep semantic source order, visible labels, and
textual equivalents so the page remains understandable without layout or color.
Create a standalone preview before requesting publication or update approval:

```bash
waymark preview --title "Release plan" \
  --output release-plan.html release-plan.waymark.html
```

The interface is:

```text
waymark preview --title TITLE --output FILE [--force] <body-file|->
```

Preview is local and deterministic: it does not authenticate, use the network,
open a browser, or publish. It refuses to overwrite an existing output unless
`--force` is supplied. Inspect the latest preview for the intended title,
section order, navigation targets, textual equivalents, and clipped or missing
content. The body source has no doctype, full-document tags, `<style>`, or
`<script>` elements. Plans also exclude raw mode, plan-supplied scripts and
styles, secrets, and invented facts.

For a generic report, prepare one complete, self-contained HTML document. Its
CSS, layout, typography, responsive behavior, and print rules belong to that
report rather than the Waymark theme. `waymark preview` does not accept raw
input; inspect the exact local document directly in a browser before requesting
publication or update approval.

Completion criterion: the exact latest plan preview or raw report document was
inspected for title, order, navigation, textual equivalents, and content
visibility; themed plan structural validation also passes.

### 3. Request exact approval

Local creation and review leave remote state unchanged. After the latest local
inspection and any applicable themed structural verification, ask for approval
that names the exact next action:

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

Use the approved source and its required rendering mode:

```bash
# Raw report
waymark create --raw --json --title "Quarterly review" --ttl 7 quarterly-review.html

# Themed visual plan
waymark create --json --title "Release plan" --ttl 0 release-plan.waymark.html
```

Use `--ttl 0` only for an explicitly permanent page. Put every flag before
positional arguments. Read the authoritative page ID, URL, TTL, and
`updated_at` from the successful JSON create output before recording them beside
the local canonical source. Verify the public URL after recording the result.

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

Before requesting update approval, fetch `waymark get --json <id>` and use its
authoritative `updated_at` as the known local timestamp. If no timestamp is
known, establish it before seeking approval. A prior read followed by an
unconditional update is not concurrency protection; the update request itself
must carry the server-enforced condition and JSON output:

```bash
waymark update --raw --if-updated-at "<last-known-updated-at>" --json <id> quarterly-review.html
```

Use `--raw` for reports and omit it for themed visual plans. For direct JSON
requests, send the same condition as
`"if_updated_at":"<last-known-updated-at>"`. Stop immediately on HTTP 409 or
any conflict; reconcile with a fresh JSON get and renewed approval before
retrying. On success, take the authoritative new `updated_at` from the JSON
update output before recording it. A page is never deleted automatically.

Completion criterion: the approved update used the server-enforced timestamp
condition, its JSON result supplied the recorded new `updated_at`, or HTTP 409 /
conflict stopped the run with reconciliation documented.

## Artifact invariants

- Visual plans use themed body-only HTML. They never use raw mode or supply
  custom CSS or JavaScript.
- Generic reports use raw, complete, self-contained HTML and own their design,
  responsive behavior, and print rules.
- The documented component class names and structures are the visual-plan markup
  grammar. Plain semantic HTML remains valid when a component adds no
  comprehension.
