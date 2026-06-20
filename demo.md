would it require complicated or messy changes to make a "demo" mode where all the data on the dashboard is anonymous fake data? Would it be possible to generate something based on the schemas?

1. One interception layer, not 30 components.\*_ Essentially all dashboard data flows through `/api/_` HTTP calls via just two mechanisms:

- RTK Query (14 API slices, all built on one `emptyApi` with `baseUrl: "/"`)
- a single `fetchToJson` helper + a few raw `fetch` calls

So you intercept HTTP, not rewrite components.

**2. MSW is already a dependency** (`msw ^2.14.6`) and already used with `http`/`HttpResponse` handlers in tests. MSW also runs **in the browser** via a service worker. That's your demo engine for free: register one handler per endpoint that returns fake data, start the worker before the app renders when a demo flag is set. Components stay untouched.

**3. The schemas are real and centralized.** Every endpoint has an OpenAPI YAML in `libs/types/definitions` with `example:` values per field, and codegen already parses them. You can generate fake responses from these.

## Recommended approach

Client-side demo mode (no server needed → deployable as a static demo):

- A build flag / `/demo` route that starts the MSW browser worker
- One handler per `/api/*` endpoint
- Stub the login flow so it auto-"authenticates"

## On generating from schemas

Partly yes, with a caveat:

- **Scalar/object endpoints** (status, smart-entities, monit, etc.): `json-schema-faker` + `@faker-js/faker` driven by the YAML gives anonymous, type-correct data automatically. The existing `example` values are already mostly anonymous.
- **Chart/time-series endpoints** (energy, temperature, water, gas): the schemas only describe _one_ array item, so naive generation yields flat, boring charts. These few endpoints want a small generator that produces realistic trending arrays (or curated fixtures). That's the only "hand-written" part.
- Don't forget some kind of mock data for the DataLora Map.

## Caveats / scope

- Non-JSON bits (video stream, jukebox audio, any websockets) need hiding or static stubs in demo mode.
- Anonymization: real `friendly_name`/`entity_id` values could be sensitive — faker handles that, so prefer generated over copied prod data.

**Effort estimate:** roughly a day for a schema-driven generator + MSW wiring + auth stub, plus a few hours each for the handful of chart endpoints. No invasive refactoring of components or the server.
