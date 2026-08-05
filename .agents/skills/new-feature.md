# New feature setup

Guidance for adding a new feature to this repo. Read this in full before
starting nontrivial feature work.

## 1. Adding a new API

If the feature involves talking to a new external service, or adding a new
internal client<->server API, define it as an OpenAPI schema first and
generate types from it — don't hand-write request/response types.

### External API (HomeRemote calling a third-party service)

1. Create `libs/types/definitions/external/<name>.yml`, modeled on the
   existing `libs/types/definitions/external/portainer.yml` (OpenAPI 3.0.1,
   `paths` for the subset of endpoints actually used, `components.schemas`
   for the response/request shapes). Keep it a lean subset of the real API —
   only what HomeRemote consumes.
2. Register it in `redocly.yaml` under `apis`:
   ```yaml
   <name>@v1:
       root: ./libs/types/definitions/external/<name>.yml
       x-openapi-ts:
           output: ./libs/types/src/lib/external/generated/<name>.ts
   ```
3. Generate the types: `npm run codegen:server`.

### Internal API (client <-> HomeRemote server)

1. Create `libs/types/definitions/internal/<name>.yml`, following the
   existing files in that folder (e.g. `smartEntities.yml`).
2. Register it in `redocly.yaml` under `apis` (same shape as above, output
   under `libs/types/src/lib/generated/<name>.ts`).
3. Add an entry to `outputFiles` in `openapi-config.cts` so an RTK Query API
   slice gets generated for the client.
4. Generate the types: `npm run codegen:client` (or `npm run codegen` to do
   both client and server in one go).

## 2. Sizing the feature

Before writing code, judge whether the feature is small (one focused change)
or big enough to naturally split into multiple stages (e.g. schema + codegen,
then server implementation, then client UI, then wiring/tests).

- **Small feature**: just implement it.
- **Bigger feature (multiple stages)**: say so explicitly, propose the
  stages, and recommend agreeing on a plan first (e.g. plan mode / ask mode)
  before any code is written.

## 3. Working in stages

When a feature is being done in stages:

- After each stage, run validation before moving to the next stage:
  `npm run validate` (runs `typecheck`, `lint`, and `test:ci`), or the
  narrower `npm run typecheck` / `npm run lint` / `npm run test:ci` if a
  faster loop is preferred for that stage. Don't start the next stage on a
  broken one.
- After each stage completes and validates cleanly, ask the user whether to
  commit that stage before continuing — don't commit automatically.
