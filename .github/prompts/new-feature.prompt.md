---
mode: agent
description: Set up a new feature in this repo — new API schemas/types, and the plan/stage/validate/commit workflow for bigger features.
---

# New feature setup

Read `.agents/skills/new-feature.md` at the repo root in full before starting
the work — it covers:

1. Creating an OpenAPI schema and generating types for any new external or
   internal API (with the exact files to create/register and the codegen
   commands to run).
2. When to call out that a feature should be split into stages, and
   recommending agreeing on a plan before writing code.
3. The validate-then-ask-to-commit workflow to follow after each stage.

This file is intentionally just a pointer — `.agents/skills/new-feature.md`
is the canonical source, shared with the Claude Code equivalent at
`.claude/skills/new-feature/SKILL.md`.
