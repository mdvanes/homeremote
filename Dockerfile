#### BUILD AND VALIDATE STAGE ####
FROM node:24 AS build-env

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
FROM node:24-alpine AS build-alpine-env

ARG INSTALL_TIMEOUT

WORKDIR /app

# jq is used below to strip devDependencies
RUN apk --no-cache add --virtual .builds-deps jq

# Copy the files needed before npm install
COPY --from=build-env /home/node/code/package.json /home/node/code/package-lock.json ./
COPY --from=build-env /home/node/code/dist/apps/server ./dist/apps/server

# Yarn does not properly support the --prod flag and npm fails with timeout.
# So manually strip devDependencies from package.json
RUN jq 'del(.devDependencies)' package.json > tmp.json && mv tmp.json package.json

# NOTE: timeout settings seem to have no effect, but disabling VPN does (timeout after 1796s instead of 110s) But still fails and is incredibly slow. Disabling DNS proxy also seems to help.
# Install only production dependencies.
# YOUTUBE_DL_SKIP_PYTHON_CHECK skips youtube-dl-exec's preinstall python check;
# python3 is not needed at install time and is provided in the runtime stage.
RUN YOUTUBE_DL_SKIP_PYTHON_CHECK=1 npm ci $INSTALL_TIMEOUT

# Clean up build artifacts
RUN apk del .builds-deps

#### RUNTIME STAGE ####
FROM node:24-alpine

WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache curl python3 ffmpeg

# Set a symlink because some deps need `python`
# RUN ln -s /usr/bin/python3 /usr/bin/python # Suddenly, python is included in the image?

# Copy assets from the previous stage
COPY --from=build-alpine-env /app/package.json ./package.json
COPY --from=build-alpine-env /app/node_modules ./node_modules
COPY --from=build-alpine-env /app/dist/apps/server ./dist/apps/server

# Run the server, map config files when running the container. Also see docker-compose
CMD ["node", "dist/apps/server/main.js"]
