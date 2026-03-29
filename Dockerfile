ARG NODE_VERSION=25

FROM node:25-alpine AS base
WORKDIR /usr/src/app

# Build stage
FROM base AS build
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Final stage
FROM node:25-alpine AS final
WORKDIR /usr/src/app
ENV NODE_ENV=production

# Install static server
RUN npm install -g serve

COPY --from=build /usr/src/app/dist ./dist

EXPOSE 4173

CMD ["serve", "-s", "dist", "-l", "4173"]
