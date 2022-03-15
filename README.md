# HomeRemote

Web GUI in ES6 React for a Node backend that calls scripts spread out over several debian/ubuntu servers. The scripts 
are Upstart scripts to start/stop a radio playing service and direct shell calls to toggle a remote control for lightswitches.

Material Design:

* Material UI
* Keep.google.com
* https://codelabs.developers.google.com/codelabs/polymer-2-carousel/

## Screenshot

![Screenshot](screenshot.png)

## Installation

Requirements:

- Nginx/Traefik reverse proxy with SSL
- [Domoticz](https://www.domoticz.com/) server (optional)
- [DataLora](https://github.com/mdvanes/datalora) (optional)

- WIP

## Adding a user

- This endpoint is only enabled in development mode
- Start dev server: `yarn start:dev-temp`
- For password "test", call (e.g. in browser) `http://localhost:4200/api/pw-to-hash/?password=test`
- Store the hash with the username in auth.json

## Running

Development:

- serve all: `yarn start` or `yarn nx run-many --target=serve --projects=server,client --parallel`

Other utils:

- serve client: `yarn nx serve:all` or `yarn nx serve client` or `yarn nx run client:serve`
- Add an app (without e2e): `yarn nx g @nrwl/react:application --name=client --e2eTestRunner=none --dry-run` or `yarn nx g @nrwl/nest:application --name=server --frontendProject=client --dry-run`
- Remove an app: `yarn nx g rm homeremote-server-e2e --dry-run` 
- Move/rename an app: `yarn nx g mv --project homeremote client --dry-run`
- To build storybook run: `yarn nx run demo:build-storybook`
- Run lint on all projects: `yarn nx run-many --all --target=lint` (with `yarn nx lint` only the default project is linted) or for a specific project `yarn nx run server:lint`
- Testing:
  - with watch: `yarn test:client` or `yarn nx test client --watch`
  - a single file without coverage and with watch, e.g. users.service: `yarn test:server --testFile=users.service`
- Add a controller: `yarn nx g @nrwl/nest:controller --name=foo --project=server --module=app --dry-run`
- Format (prettier):
  - check changed: `yarn nx format:check`
  - format changed: `yarn nx format:check`
  - format all: `yarn nx format:write --all`

Api proxying: server is running on 3333 and client on 4200, but a proxy.conf.json exists that forwards /api from 4200 to 3333. 
- `yarn start`
- This URL works: http://localhost:4200/api/profile/current

env files: https://nx.dev/guides/environment-variables

Building / Run in production:

- Optional: test building with `yarn build`
- Make sure apps/server/.env and apps/server/auth.json exist
- Set correct path for volumes in docker-compose.yml
- When on Mac with Lima: disable docker.sock volume in docker-compose.yml (or try https://github.com/abiosoft/colima)
- `docker-compose up -d --build`. Build duration: ca. 4 minutes
- On Mac with Lima use `docker compose -f docker-compose.yml -f docker-compose.override.yml up --build`. Real docker-compose automatically finds docker-compose.yml and docker-compose.override.yml.
- Show logs: `docker-compose logs --follow`
- Alternative, instead of docker compose (e.g. for debugging): 
  - `docker build -t homeremotenx .` and
  - `docker run --rm --name homeremotenx homeremotenx ls -lah dist/apps/server/src/assets/`
- If yarn install fails with timeouts on Mac with Lima compose (`lima nerdctl compose up`):
  - Seems to be Lima issue: https://github.com/lima-vm/lima/issues/561
  - https://github.com/yarnpkg/yarn/issues/5259
  - Solved by setting `RUN yarn install --frozen-lockfile --network-timeout 1000000` in Dockerfile

Publishing:

1. Merge changes to main branch
2. Tag with GitHub UI or with `git tag -a v3.0.0 -m "publish version 3.0.0"` and push
3. Wait for CI to finish, and all tests are OK
4. On dev machine, build image with correct version: `docker build . -t mdworld/homeremote:3.0.0`
5. On dev machine, push image to registry:
  - Note: should also work with nerdctl on Mac, see https://github.com/containerd/nerdctl/blob/master/docs/registry.md#docker-hub
  - `docker login --username=yourhubusername --email=youremail@company.com`
  - `docker push mdworld/homeremote:3.0.0`
6. On the target server: set up settings/auth, settings/env and docker-compose
7. On the target server: `docker-compose up -d`
  - `git clone` or `git pull`
  - `docker-compose up -d`

Migration todo:

- Fixed: run tests
- Fixed: Fix build (copy client to server). Run with `yarn build` and then `node dist/apps/server/main.js` (needs to load the .env (docker-compose?) and auth.json (check blue lines in log!))
- Fixed: PUBLIC_HTML in index.html
- Fixed: production serve index.html (/app/apps/server/src/assets/) in Docker. On Mac, on `docker compose up --build` fails with `244.0 error An unexpected error occurred: "https://registry.npmjs.org/rxjs/-/rxjs-7.5.4.tgz: ESOCKETTIMEDOUT".`
- Fixed: lint with prettier
- Fixed: Clean up and remove OLD dir
- Dedupe FE/BE types: server/api-types, datalora types, switches types, etc.
- Add extra linting: https://github.com/nodesecurity/eslint-plugin-security and https://github.com/jonaskello/eslint-plugin-functional
- Release and replace production version
- Service workers is registered, but implementation of service-worker is incorrect / not caching when offline
- https://github.com/henrikjoreteg/fixpack or `npm remove @mdworld/example && npm remove -D @mdworld/example`
- Homeremote simple bookmarklist of services (in sidebar?)
- add WHO to log: CEF, Common Event Format, When Where Who What, Is the log persisted? 
- Reactive/observable for InfluxDB

## Notes

-  "noPropertyAccessFromIndexSignature": was turned to false when migrating, also see https://www.typescriptlang.org/tsconfig#noPropertyAccessFromIndexSignature


## Adding capabilities to your workspace

Nx supports many plugins which add capabilities for developing different types of applications and different tools.

These capabilities include generating applications, libraries, etc as well as the devtools to test, and build projects as well.

Below are our core plugins:

- [React](https://reactjs.org)
  - `npm install --save-dev @nrwl/react`
- Web (no framework frontends)
  - `npm install --save-dev @nrwl/web`
- [Angular](https://angular.io)
  - `npm install --save-dev @nrwl/angular`
- [Nest](https://nestjs.com)
  - `npm install --save-dev @nrwl/nest`
- [Express](https://expressjs.com)
  - `npm install --save-dev @nrwl/express`
- [Node](https://nodejs.org)
  - `npm install --save-dev @nrwl/node`

There are also many [community plugins](https://nx.dev/community) you could add.

## Generate an application

Run `nx g @nrwl/react:app my-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

## Generate a library

Run `nx g @nrwl/react:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@homeremote/mylib`.

## Development server

Run `nx serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `nx g @nrwl/react:component my-component --project=my-app` to generate a new component.

## Build

Run `nx build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `nx test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `ng e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx dep-graph` to see a diagram of the dependencies of your projects.
