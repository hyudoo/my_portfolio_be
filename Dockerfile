# Build stage
FROM node:20-slim AS build-stage

ARG NODE_OPTIONS
ENV NODE_OPTIONS=$NODE_OPTIONS

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

# Production stage
FROM node:20-slim AS prod-stage

WORKDIR /app

RUN apt update -y && apt install -y ffmpeg

COPY --from=build-stage /app/dist /app
COPY --from=build-stage /app/package.json /app/package.json
COPY --from=build-stage /app/yarn.lock /app/yarn.lock
COPY --from=build-stage /app/.env /app/.env

RUN yarn install --frozen-lockfile --production && yarn cache clean

EXPOSE $PORT

CMD ["node", "main.js"]