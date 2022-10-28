#### BUILD AND VALIDATE STAGE ####
FROM node:16 AS build-env

ARG INSTALL_TIMEOUT

WORKDIR /home/node/code

# CI = true is needed to disable nx daemon. Otherwise npm lint/test/build will break.
ENV CI true

# Workaround for missing binary
RUN npm i -g @swc/core-linux-x64-gnu

# Copy the files needed before npm install
COPY package.json package-lock.json ./

# Install npm dependencies and fail if lock file requires changes
RUN npm ci $INSTALL_TIMEOUT

# Copy git dir for writeGitInfo
COPY .git/ ./.git/

# Copy the source files to be able to cache Docker layers up to this point
COPY . .

# Needed by typecheck and unit test
RUN cp apps/server/auth.json.example apps/server/auth.json

# Note --ignore-scripts does not work on composite npm run build
RUN npm run build

# Should not be published
RUN rm apps/server/auth.json

#### INSTALL DEPS FOR ALPINE STAGE ####
FROM node:16-alpine AS build-alpine-env

ARG INSTALL_TIMEOUT

WORKDIR /app

# For bcrypt build that works on Alpine
RUN apk --no-cache add --virtual .builds-deps build-base python3 jq

# Set a symlink because some deps need `python` to rebuild
RUN ln -s /usr/bin/python3 /usr/bin/python

# Copy the files needed before npm install
COPY --from=build-env /home/node/code/package.json /home/node/code/package-lock.json ./
COPY --from=build-env /home/node/code/dist/apps/server ./dist/apps/server

# Yarn does not properly support the --prod flag, npm fails with timeout, and reinstall of node_modules is neccesary for bcrypt. npm rebuild instead of reinstall does not seem to work.
# So manually strip devDependencies from package.json
RUN jq 'del(.devDependencies)' package.json > tmp.json && mv tmp.json package.json

# Skip only postinstall here. The --ignore-scripts flag also ignores build for the bcrypt dependency
# RUN npm set-script postinstall ""

# NOTE: timeout settings seem to have no effect, but disabling VPN does (timeout after 1796s instead of 110s) But still fails and is incredibly slow. Disabling DNS proxy also seems to help.
# Install only production dependencies
RUN npm ci $INSTALL_TIMEOUT

# Clean up build artifacts
RUN apk del jq

#### RUNTIME STAGE ####
FROM node:16-alpine

WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache curl python3 ffmpeg

# Set a symlink because some deps need `python`
RUN ln -s /usr/bin/python3 /usr/bin/python

# Copy assets from the previous stage
COPY --from=build-alpine-env /app/package.json ./package.json
COPY --from=build-alpine-env /app/node_modules ./node_modules
COPY --from=build-alpine-env /app/dist/apps/server ./dist/apps/server

# Run the server, map config files when running the container. Also see docker-compose
CMD ["node", "dist/apps/server/main.js"]