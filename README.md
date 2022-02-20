

# Homeremote

Development:

- serve all: `yarn start` or `yarn nx run-many --target=serve --projects=server,client --parallel`
- serve client: `yarn nx serve:all` or `yarn nx serve client` or `yarn nx run client:serve`

- Add an app (without e2e): `yarn nx g @nrwl/react:application --name=client --e2eTestRunner=none --dry-run` or `yarn nx g @nrwl/nest:application --name=server --frontendProject=client --dry-run`
- Remove an app: `yarn nx g rm homeremote-server-e2e --dry-run` 
- Move/rename an app: `yarn nx g mv --project homeremote client --dry-run`
- To build storybook run: `yarn nx run demo:build-storybook`
- Run lint on all projects: `yarn nx run-many --all --target=lint` (with `yarn nx lint` only the default project is linted)
- Test with watch: `yarn nx test frontend --watch`
- Add a controllor: `yarn nx g @nrwl/nest:controller --name=foo --project=server --module=app --dry-run`

Api proxying: server is running on 3333 and client on 4200, but a proxy.conf.json exists that forwards /api from 4200 to 3333. 
- `yarn start`
- This URL works: http://localhost:4200/api/profile/current

env files: https://nx.dev/guides/environment-variables

Migration todo:

- Fixed: run tests
- Fix build (copy client to server)
- Fix lint with prettier
- https://github.com/henrikjoreteg/fixpack or `npm remove @mdworld/example && npm remove -D @mdworld/example`
- Dedupe FE/BE types: server/api-types, datalora types, switches types, etc.
- Homeremote simple bookmarklist of services
- add WHO to log: CEF, Common Event Format, When Where Who What, Is the log persisted? 

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

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.



## ☁ Nx Cloud

### Distributed Computation Caching & Distributed Task Execution

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-cloud-card.png"></p>

Nx Cloud pairs with Nx in order to enable you to build and test code more rapidly, by up to 10 times. Even teams that are new to Nx can connect to Nx Cloud and start saving time instantly.

Teams using Nx gain the advantage of building full-stack applications with their preferred framework alongside Nx’s advanced code generation and project dependency graph, plus a unified experience for both frontend and backend developers.

Visit [Nx Cloud](https://nx.app/) to learn more.
