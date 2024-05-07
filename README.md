# HomeRemote

Web GUI in ES6 React for a Node backend that calls scripts spread out over several debian/ubuntu servers. The scripts
are Upstart scripts to start/stop a radio playing service and direct shell calls to toggle a remote control for lightswitches.

Material Design:

-   Material UI
-   Keep.google.com
-   https://codelabs.developers.google.com/codelabs/polymer-2-carousel/

## Screenshot

![Screenshot](screenshot.png)

## Installation

Requirements:

-   Nginx/Traefik reverse proxy with SSL
-   [Domoticz](https://www.domoticz.com/) server (optional)
-   [DataLora](https://github.com/mdvanes/datalora) (optional)

-   WIP

## Adding a user

-   This endpoint is only enabled in development mode
-   Start dev server: `npm start`
-   For password "test", call (e.g. in browser) `http://localhost:4200/api/pw-to-hash/?password=test`
-   Store the hash with the username in auth.json

## Running

Development:

-   serve all: `npm start` or `npx nx run-many --target=serve --projects=server,client --parallel`

Other utils:

-   serve client: `npx nx serve:all` or `npx nx serve client` or `npx nx run client:serve`
-   Add an app (without e2e): `npx nx g @nx/react:application --name=client --e2eTestRunner=none --dry-run` or `npx nx g @nx/nest:application --name=server --frontendProject=client --dry-run`
-   Remove an app: `npx nx g rm homeremote-server-e2e --dry-run`
-   Move/rename an app: `npx nx g mv --project homeremote client --dry-run`
-   To build storybook run: `npx nx run demo:build-storybook`
-   Run lint on all projects: `npx nx run-many --all --target=lint` (with `npx nx lint` only the default project is linted) or for a specific project `npx nx run server:lint`
-   Testing:
    -   with watch: `npm run test:client` or `npx nx test client --watch`
    -   a single file without coverage and with watch, e.g. users.service: `npm run test:server -- --testFile=users.service`
-   Add a controller: `npx nx g @nx/nest:controller --name=foo --project=server --module=app --dry-run`
-   Format (prettier):
    -   check changed: `npx nx format:check`
    -   format changed: `npx nx format:write`
    -   format all: `npx nx format:write --all`

Api proxying: server is running on 3333 and client on 4200, but a proxy.conf.json exists that forwards /api from 4200 to 3333.

-   `npm start`
-   This URL works: http://localhost:4200/api/profile/current

env files: https://nx.dev/guides/environment-variables

Building / Run in production:

-   Install on Mac: python is on path, but can't be found by npm, even with `npm config python`. This makes the youtube-dl dependency installation fail when running `npm i` or `npm i -f` or even `npm i --python=python3`. For now, just remove `youtube-dl` on Mac from package.json, `npm i`, `npm i youtube-dl@^3.5.0 --ignore-scripts`
-   Python also failing Mac M1 and Ubuntu now. `which python` gives nothing, `which python3` gives `/usr/bin/python3`. Symlink: `ln -s /usr/bin/python3 /usr/bin/python`
-   Optional: test building with `npm run build`
-   Make sure apps/server/.env and apps/server/auth.json exist
-   Set correct path for volumes in docker-compose.yml
-   When on Mac with Lima: disable docker.sock volume in docker-compose.yml (or try https://github.com/abiosoft/colima)
-   `docker-compose up -d --build`. Build duration: ca. 4 minutes
-   On Mac with colima use
    -   `colima start --network-address`
    -   `DOCKER_DEFAULT_PLATFORM=linux/amd64 docker compose -f docker-compose.override.yml up --build`. Real docker-compose automatically finds docker-compose.yml and docker-compose.override.yml.
    -   If docker.sock does not work, maybe this will help https://github.com/abiosoft/colima/blob/main/docs/FAQ.md#cannot-connect-to-the-docker-daemon-at-unixvarrundockersock-is-the-docker-daemon-running
        -   `export DOCKER_HOST="unix://${HOME}/.colima/default/docker.sock"`
        -   `sudo ln -sf $HOME/.colima/default/docker.sock /var/run/docker.sock`
        -   in docker-compose.override.yml, just map `- /var/run/docker.sock:/var/run/docker.sock`
-   Show logs: `docker-compose logs --follow`
-   Alternative, instead of docker compose (e.g. for debugging):
    -   `DOCKER_BUILDKIT=0 docker build -t homeremotenx .` and
    -   `docker run --rm --name homeremotenx homeremotenx ls -lah dist/apps/server/src/assets/`
-   If yarn install fails with timeouts on Mac with Lima compose (`lima nerdctl compose up`):
    -   Seems to be Lima issue: https://github.com/lima-vm/lima/issues/561
    -   https://github.com/yarnpkg/yarn/issues/5259
    -   Solved by setting `RUN yarn install --frozen-lockfile --network-timeout 1000000` in Dockerfile

Publishing:

Publishing is done automatically when tagging on the main branch. So make sure to set up

-   secrets.DOCKER_USERNAME
-   secrets.DOCKER_PASSWORD

1. Merge changes to main branch
2. Update version in package.json to `X.Y.Z`, e.g. 3.0.0
3. Tag with GitHub UI or with `git tag -a vX.Y.Z -m "publish version X.Y.Z"` and push `git push --tags`
4. Wait for CI to finish, and all tests are OK. This will automatically build and push to the docker registry. To do this by hand, do this:

-   ONLY WHEN MANUAL: On dev machine, build image with correct version: `docker build -t mdworld/homeremote:X.Y.Z .` (on mac `docker build --build-arg INSTALL_TIMEOUT="--network-timeout 1000000" -t mdworld/homeremote:X.Y.Z .`)
-   ONLY WHEN MANUAL: On dev machine, push image to registry:
    -   Note: should also work with nerdctl on Mac, see https://github.com/containerd/nerdctl/blob/master/docs/registry.md#docker-hub
    -   `docker login --username=yourhubusername`
    -   `docker push mdworld/homeremote:X.Y.Z`
    -   `docker logout`

7. On the target server, set up:

-   ~/homeremote/settings/auth (use apps/server/auth.json.example as base)
-   ~/homeremote/settings/.env (use apps/server/.env.example as base)
-   ~/homeremote/docker-compose.yml (copy docker-compose.yml from this project)

8. Update the version in docker-compose.yml
9. On the target server: `docker-compose up -d`

## Generate types

-   Intercept a JSON to the intended endpoint, e.g. with cURL
-   Save the JSON in `./libs/types/examples`. The `internal` subdir is for endpoints in this repo, the `external` subdir is for endpoints outside this repo, e.g. from third parties if they don't provide their own OpenApi descriptions.
-   Run `npx mock-to-openapi ./libs/types/examples`
-   Copy the generated snippet from `./libs/types/examples` to the appropriate schema in `./libs/types/definitions`
-   If there is no schema yet, this can be helpful to build one: https://editor.swagger.io/
-   Run `npm run codegen`
-   Types should be generated for the server and hooks for the client.

## Notes

-   "noPropertyAccessFromIndexSignature": was turned to false when migrating, also see https://www.typescriptlang.org/tsconfig#noPropertyAccessFromIndexSignature

-   For Apple Silicon / ARM / Mac M1 there is an issue that the build will because it uses a platform specific version of @swc/core. Adding the ARM specific version @swc/core-darwin-arm64 breaks CI. Workaround to test the build locally is: `docker build . -t mdworld/homeremote:latest --platform=linux/amd64`

-   For Apple Silicon / ARM / Mac M1 with Colima, when Docker build fails with 'killed', try increasing available memory to 8GB with `colima stop && colima start --cpu 2 --memory 8`

### Subsonic API_TOKEN

JUKEBOX_API_TOKEN is md5 of "subsonic password" + "some random salt"

```
FOO="$password$salt"

# Mac:
echo -n FOO | md5
# Linux:
echo -n FOO | md5sum
```
