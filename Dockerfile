
FROM node:16 AS build-env

WORKDIR /home/node/code

# Copy the files needed before yarn install
COPY package.json yarn.lock bsconfig.json ./

# Copy the rescript source for the postinstall script
COPY ./apps/client/src/Dummy.res ./apps/client/src/

# Install npm dependencies and fail if lock file requires changes. Skip postinstall script that needs the source files
#  --ignore-scripts # ignore scripts also breaks bcrypt dependency
RUN yarn install --frozen-lockfile

# Copy git dir for writeGitInfo
COPY .git/ ./.git/

# Copy the source files to be able to cache Docker layers up to this point
COPY . .

# Note --ignore-scripts does not work on composite yarn build
RUN yarn build

# Remove all npm dependencies not needed for production
RUN npm prune --production

FROM node:16-alpine

WORKDIR /app

# Install runtime dependencies
# # RUN apk add --no-cache --virtual .gyp python3 make g++
RUN apk add --no-cache curl python3 ffmpeg py3-eyed3

COPY --from=build-env /home/node/code/package.json ./package.json
COPY --from=build-env /home/node/code/node_modules ./node_modules
COPY --from=build-env /home/node/code/dist/apps/server ./dist/apps/server

# Run the server, map config files when running the container. Also see docker-compose
CMD ["node", "dist/apps/server/main.js"]