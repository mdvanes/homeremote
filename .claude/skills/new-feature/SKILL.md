---
name: new-feature
description: Use when starting work on a new feature in this repo — adding a new external/internal API integration, or any feature request that isn't a trivial one-line change. Covers creating OpenAPI schemas and generating types for new APIs, and the plan/stage/validate/commit workflow for larger multi-step features. Triggers on "add a new feature", "integrate with X API", "add an endpoint for X", "new API", "implement X" (X is nontrivial).
---

# New feature setup

Read `.agents/skills/new-feature.md` at the repo root in full before starting
the work — it covers:

1. Creating an OpenAPI schema and generating types for any new external or
   internal API (with the exact files to create/register and the codegen
   commands to run).
2. When to call out that a feature should be split into stages, and
   recommending plan mode before writing code.
3. The validate-then-ask-to-commit workflow to follow after each stage.

This file is intentionally just a pointer — `.agents/skills/new-feature.md`
is the canonical source, shared with the Copilot equivalent at
`.github/prompts/new-feature.prompt.md`.
