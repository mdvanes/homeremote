
FROM node:16 AS build-env

# TODO Cleanup

# RUN apk add --no-cache --virtual .gyp python3 make g++

# This hack is widely applied to avoid python printing issues in docker containers.
# See: https://github.com/Docker-Hub-frolvlad/docker-alpine-python3/pull/13
# ENV PYTHONUNBUFFERED=1

# RUN apk add --no-cache python2 && \
#     python -m ensurepip && \
#     rm -r /usr/lib/python*/ensurepip && \
#     pip install --upgrade pip setuptools && \
#     rm -r /root/.cache

# RUN echo "**** install Python ****" && \
#     apk add --no-cache python3 && \
#     if [ ! -e /usr/bin/python ]; then ln -sf python3 /usr/bin/python ; fi && \
#     \
#     echo "**** install pip ****" && \
#     python3 -m ensurepip && \
#     rm -r /usr/lib/python*/ensurepip && \
#     pip3 install --no-cache --upgrade pip setuptools wheel && \
#     if [ ! -e /usr/bin/pip ]; then ln -s pip3 /usr/bin/pip ; fi

# Install OS level dependencies
# RUN apk add --no-cache curl \
#     && apk add --no-cache --virtual .gyp make g++

# Set up the "node" user
#RUN useradd -ms /bin/bash node
# USER node
# RUN mkdir -p /home/node/code
# RUN chown node /home/node/code
WORKDIR /home/node/code

# RUN pwd
# RUN ls -lah

# Copy the source files to be able to cache Docker layers up to this point
# COPY . .

# Copy the files needed before yarn install
COPY package.json yarn.lock bsconfig.json ./

# Copy the rescript source for the postinstall script
COPY ./apps/client/src/Dummy.res ./apps/client/src/

# RUN ls -lah

# Install npm dependencies and fail if lock file requires changes. Skip postinstall script that needs the source files
#  --ignore-scripts # ignore scripts also breaks bcrypt dependency
RUN yarn install --frozen-lockfile

# Run postinstall that includes rescript build
#RUN yarn postinstall1

# Copy git dir for writeGitInfo
COPY .git/ ./.git/

# Copy the source files to be able to cache Docker layers up to this point
COPY . .

# TODO writeGitInfo would fail because .git not copied
# RUN yarn nx --version
# RUN ls -lah
# RUN cat yarn-error.log
# RUN yarn lint
# RUN ls node_modules/bcrypt
# RUN ls node_modules/bcrypt/lib
# TODO this file is not missing when COPY . . is used before yarn install
# RUN ls node_modules/bcrypt/lib/binding/napi-v3
# TODO Test (and later build) is failing with: Error: Cannot find module '/app/node_modules/bcrypt/lib/binding/napi-v3/bcrypt_lib.node'
# RUN yarn test:server:ci
# RUN yarn test:client:ci
# RUN yarn nx run server:build
# RUN yarn nx run client:build --verbose
# Note --ignore-scripts does not work on composite yarn build
RUN yarn build
# # RUN yarn writeGitInfo

# # Remove all npm dependencies not needed for production
RUN npm prune --production

FROM node:16-alpine

WORKDIR /app

# Install runtime dependencies
# # RUN apk add --no-cache --virtual .gyp python3 make g++
RUN apk add --no-cache curl python3 ffmpeg py3-eyed3

COPY --from=build-env /home/node/code/package.json ./package.json
# COPY --from=build-env /home/node/code/.env.local ./.env.local
COPY --from=build-env /home/node/code/node_modules ./node_modules
COPY --from=build-env /home/node/code/dist/apps/server ./dist/apps/server

# node dist/apps/server/main.js
# CMD ["yarn", "next", "start", "-p", "3031"]
# Run the server, map config files when running the container. Also see docker-compose
CMD ["node", "dist/apps/server/main.js"]