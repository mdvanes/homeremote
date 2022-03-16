
FROM node:16 AS build-env

ARG INSTALL_TIMEOUT

WORKDIR /home/node/code

# Copy the files needed before yarn install
COPY package.json yarn.lock bsconfig.json ./

# Copy the rescript source for the postinstall script
COPY ./apps/client/src/Dummy.res ./apps/client/src/

# Install npm dependencies and fail if lock file requires changes. Skip postinstall script that needs the source files
#  --ignore-scripts # ignore scripts also breaks bcrypt dependency
RUN yarn install --frozen-lockfile $INSTALL_TIMEOUT

# Copy git dir for writeGitInfo
COPY .git/ ./.git/

# Copy the source files to be able to cache Docker layers up to this point
COPY . .

# Note --ignore-scripts does not work on composite yarn build
RUN yarn build

# # Remove all npm dependencies not needed for production
# RUN npm prune --production

# Build for alpine stage
FROM node:16-alpine AS build-alpine-env

ARG INSTALL_TIMEOUT

WORKDIR /app

# For bcrypt build that works on Alpine
RUN apk --no-cache add --virtual .builds-deps build-base python3 jq

RUN ln -s /usr/bin/python3 /usr/bin/python


# Copy the files needed before yarn install
# COPY package.json yarn.lock bsconfig.json ./
# COPY --from=build-env /home/node/code/package.json ./package.json
COPY --from=build-env /home/node/code/package.json /home/node/code/yarn.lock /home/node/code/bsconfig.json  ./
# COPY --from=build-env /home/node/code/node_modules ./node_modules
COPY --from=build-env /home/node/code/dist/apps/server ./dist/apps/server

# Yarn does not properly support the --prod flag, npm fails with timeout, and reinstall of node_modules is neccesary for bcrypt. npm rebuild instead of reinstall does not seem to work.
# So manually strip devDependencies from package.json
RUN jq 'del(.devDependencies)' package.json > tmp.json && mv tmp.json package.json

# Skip only postinstall here. The --ignore-scripts flag also ignores build for the bcrypt dependency
RUN npm set-script postinstall ""
# but this also runs rescript rebuild without the --ignore-scripts flag...

# TODO convert yarn.lock to package-lock.json?

# TODO in this case, rescript post install fails
RUN yarn install --frozen-lockfile $INSTALL_TIMEOUT
# RUN yarn install --ignore-scripts --frozen-lockfile $INSTALL_TIMEOUT
# TODO timeout settings seem to have no effect, but disabling VPN does (timeout after 1796s instead of 110s) But still fails and is incredibly slow. Maybe Pi-hole?
# RUN npm config set timeout 6000000
# RUN npm config set fetch-retry-mintimeout 20000
# RUN npm config set fetch-retry-maxtimeout 6000000
# TODO try without --legacy-peer-deps
# RUN npm install --production --legacy-peer-deps
# RUN timeout=6000000 fetch_retry_mintimeout=20000 fetch_retry_maxtimeout=6000000 fetch_timeout=6000000 npm install --production --legacy-peer-deps

# TODO apk del .gyp

# RUN npm rebuild bcrypt

# Remove all npm dependencies not needed for production
# RUN npm prune --production

# Runtime stage
FROM node:16-alpine

WORKDIR /app

# Install runtime dependencies
# # RUN apk add --no-cache --virtual .gyp python3 make g++
RUN apk add --no-cache curl python3 ffmpeg py3-eyed3

# RUN yarn add bcrypt@4.0.1

# COPY --from=build-env /home/node/code/package.json ./package.json
# COPY --from=build-env /home/node/code/node_modules ./node_modules
# COPY --from=build-env /home/node/code/dist/apps/server ./dist/apps/server

COPY --from=build-alpine-env /app/package.json ./package.json
COPY --from=build-alpine-env /app/node_modules ./node_modules
COPY --from=build-alpine-env /app/dist/apps/server ./dist/apps/server


# Reinstall, because installation under Debian in the previous stage may have different binaries
#RUN yarn install --ignore-scripts --frozen-lockfile --network-timeout 1000000
# The --prod flag on yarn install seems to be broken. Prune dev deps after installation.
#RUN npm prune --production
# RUN cd node_modules/bcrypt
# RUN node-pre-gyp install --fallback-to-build
# possibly npm rebuild bcrypt could work
# RUN npm rebuild bcrypt
# RUN npm remove bcrypt --ignore-scripts && npm i bcrypt@4.0.1 --ignore-scripts

# Run the server, map config files when running the container. Also see docker-compose
CMD ["node", "dist/apps/server/main.js"]