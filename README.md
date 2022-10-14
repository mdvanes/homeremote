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
- Start dev server: `npm start`
- For password "test", call (e.g. in browser) `http://localhost:4200/api/pw-to-hash/?password=test`
- Store the hash with the username in auth.json

## Running

Development:

- serve all: `npm start` or `npx nx run-many --target=serve --projects=server,client --parallel`

Other utils:

- serve client: `npx nx serve:all` or `npx nx serve client` or `npx nx run client:serve`
- Add an app (without e2e): `npx nx g @nrwl/react:application --name=client --e2eTestRunner=none --dry-run` or `npx nx g @nrwl/nest:application --name=server --frontendProject=client --dry-run`
- Remove an app: `npx nx g rm homeremote-server-e2e --dry-run` 
- Move/rename an app: `npx nx g mv --project homeremote client --dry-run`
- To build storybook run: `npx nx run demo:build-storybook`
- Run lint on all projects: `npx nx run-many --all --target=lint` (with `npx nx lint` only the default project is linted) or for a specific project `npx nx run server:lint`
- Testing:
  - with watch: `npm run test:client` or `npx nx test client --watch`
  - a single file without coverage and with watch, e.g. users.service: `npm run test:server --testFile=users.service`
- Add a controller: `npx nx g @nrwl/nest:controller --name=foo --project=server --module=app --dry-run`
- Format (prettier):
  - check changed: `npx nx format:check`
  - format changed: `npx nx format:write`
  - format all: `npx nx format:write --all`

Api proxying: server is running on 3333 and client on 4200, but a proxy.conf.json exists that forwards /api from 4200 to 3333. 
- `npm start`
- This URL works: http://localhost:4200/api/profile/current

env files: https://nx.dev/guides/environment-variables

Building / Run in production:

- Install on Mac: python is on path, but can't be found by npm, even with `npm config python`. This makes the youtube-dl dependency installation fail when running `npm i` or `npm i -f` or even `npm i --python=python3`. For now, just remove `youtube-dl` on Mac from package.json, `npm i`, `npm i youtube-dl@^3.5.0 --ignore-scripts`
- Python also failing Mac M1 and Ubuntu now. `which python` gives nothing, `which python3` gives `/usr/bin/python3`. Symlink: `ln -s /usr/bin/python3 /usr/bin/python`
- Optional: test building with `npm run build`
- Make sure apps/server/.env and apps/server/auth.json exist
- Set correct path for volumes in docker-compose.yml
- When on Mac with Lima: disable docker.sock volume in docker-compose.yml (or try https://github.com/abiosoft/colima)
- `docker-compose up -d --build`. Build duration: ca. 4 minutes
- On Mac with Lima use `docker-compose -f docker-compose.yml -f docker-compose.override.yml up --build`. Real docker-compose automatically finds docker-compose.yml and docker-compose.override.yml.
- Show logs: `docker-compose logs --follow`
- Alternative, instead of docker compose (e.g. for debugging): 
  - `DOCKER_BUILDKIT=0 docker build -t homeremotenx .` and
  - `docker run --rm --name homeremotenx homeremotenx ls -lah dist/apps/server/src/assets/`
- If yarn install fails with timeouts on Mac with Lima compose (`lima nerdctl compose up`):
  - Seems to be Lima issue: https://github.com/lima-vm/lima/issues/561
  - https://github.com/yarnpkg/yarn/issues/5259
  - Solved by setting `RUN yarn install --frozen-lockfile --network-timeout 1000000` in Dockerfile

Publishing:

Publishing is done automatically when tagging on the main branch. So make sure to set up

- secrets.DOCKER_USERNAME
- secrets.DOCKER_PASSWORD

1. Merge changes to main branch
2. Update version in package.json to `X.Y.Z`, e.g. 3.0.0
3. Tag with GitHub UI or with `git tag -a vX.Y.Z -m "publish version X.Y.Z"` and push `git push --tags`
4. Wait for CI to finish, and all tests are OK. This will automatically build and push to the docker registry. To do this by hand, do this:
  - ONLY WHEN MANUAL: On dev machine, build image with correct version: `docker build -t mdworld/homeremote:X.Y.Z .` (on mac `docker build --build-arg INSTALL_TIMEOUT="--network-timeout 1000000" -t mdworld/homeremote:X.Y.Z .`)
  - ONLY WHEN MANUAL: On dev machine, push image to registry:
    - Note: should also work with nerdctl on Mac, see https://github.com/containerd/nerdctl/blob/master/docs/registry.md#docker-hub
    - `docker login --username=yourhubusername`
    - `docker push mdworld/homeremote:X.Y.Z`
    - `docker logout`
7. On the target server, set up: 
  - ~/homeremote/settings/auth (use apps/server/auth.json.example as base)
  - ~/homeremote/settings/.env (use apps/server/.env.example as base)
  - ~/homeremote/docker-compose.yml (copy docker-compose.yml from this project)
8. Update the version in docker-compose.yml
9. On the target server: `docker-compose up -d`

Migration todo:

- toggle during ads on radio (keyboard shortcuts)
- _Upgrade youtubedl, e.g. https://www.npmjs.com/package/youtube-dl-exec or https://www.npmjs.com/package/ytdl-core
- Upgrade nx libs to latest patch version
- postcss-import was added to packages.json for this issue, remove? https://github.com/postcss/postcss-import/issues/435
- fix `npm i` with `--legacy-peer-deps` in github ymls and Dockerfile (check if it was `npm ci`), caused by migration of @jsiebern/bs-material-ui to rescript-material-ui with newer material ui peerdep?
- Add extra linting: https://github.com/nodesecurity/eslint-plugin-security and https://github.com/jonaskello/eslint-plugin-functional
- https://github.com/henrikjoreteg/fixpack or `npm remove @mdworld/example && npm remove -D @mdworld/example`
- add WHO to log: CEF, Common Event Format, When Where Who What, Is the log persisted? 
- Reactive/observable for InfluxDB
- Service workers is registered, but implementation of service-worker is incorrect / not caching when offline. Use Nx workers?

## Notes

-  "noPropertyAccessFromIndexSignature": was turned to false when migrating, also see https://www.typescriptlang.org/tsconfig#noPropertyAccessFromIndexSignature

- For Apple Silicon / ARM / Mac M1 there is an issue that the build will because it uses a platform specific version of @swc/core. Adding the ARM specific version @swc/core-darwin-arm64 breaks CI. Workaround to test the build locally is: `docker build . -t mdworld/homeremote:latest --platform=linux/amd64`

- For Apple Silicon / ARM / Mac M1 with Colima, when Docker build fails with 'killed', try increasing available memory to 8GB with `colima stop && colima start --cpu 2 --memory 8`

### Subsonic API_TOKEN

JUKEBOX_API_TOKEN is md5 of "subsonic password" + "some random salt"

``` 
FOO="$password$salt" 

# Mac:
echo -n FOO | md5
# Linux:
echo -n FOO | md5sum
```

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
