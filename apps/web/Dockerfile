# syntax=docker/dockerfile:1

# Build context is the REPO ROOT, same reason as apps/api/Dockerfile:
#   docker build -f apps/web/Dockerfile -t kinnetics-web .
#
# Vite bakes VITE_* env vars into the JS bundle at BUILD time, which would
# mean rebuilding the image for every environment (staging vs prod have
# different API URLs). To avoid that, this image ships a tiny env.js file
# that's (re)generated from real environment variables at CONTAINER START
# (see docker-entrypoint.d/40-inject-env.sh) — the same image gets reused
# across environments, only the container's env vars change. See
# apps/web/src/lib/env.ts for the runtime read side of this.

FROM oven/bun:1-alpine AS deps
WORKDIR /app

COPY package.json bun.lock ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/db/package.json packages/db/package.json

RUN bun install --frozen-lockfile

FROM deps AS build
WORKDIR /app

COPY . .
WORKDIR /app/apps/web
RUN bun run build

FROM nginx:1.27-alpine AS runner

COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY apps/web/docker-entrypoint.d/40-inject-env.sh /docker-entrypoint.d/40-inject-env.sh
RUN chmod +x /docker-entrypoint.d/40-inject-env.sh

COPY --from=build /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80
