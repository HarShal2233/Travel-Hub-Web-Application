ARG NODE_VERSION=25

FROM node:25-alpine AS base
WORKDIR /usr/src/app

# Install dependencies
FROM base AS deps
COPY package*.json ./
RUN npm install --production

# Build stage
FROM base AS build
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Final stage
FROM base AS final
ENV NODE_ENV=production

# Use node user
USER node

COPY package.json ./
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

EXPOSE 4173

CMD ["npm", "run", "preview"]