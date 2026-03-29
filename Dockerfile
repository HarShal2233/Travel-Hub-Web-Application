

ARG NODE_VERSION=v25.8.2


FROM node:25-alpine AS base

WORKDIR /usr/src/app

FROM base AS deps

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev



FROM deps AS build


COPY package*.json ./
RUN npm install --production




FROM base AS final

ENV NODE_ENV=production

USER node

COPY package.json .
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

EXPOSE 4173

CMD ["npm", "run", "preview"]
