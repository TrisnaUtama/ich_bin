# syntax=docker/dockerfile:1

# Build context is the REPO ROOT (bun workspaces need the root lockfile +
# every workspace package.json to resolve `workspace:*` deps), so this is
# built with:
#   docker build -f apps/api/Dockerfile -t kinnetics-api .

FROM oven/bun:1-alpine AS deps
WORKDIR /app

# Copy just the manifests first so `bun install` is cached across builds
# unless a package.json / the lockfile actually changed.
COPY package.json bun.lock ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/db/package.json packages/db/package.json

RUN bun install --frozen-lockfile

FROM deps AS runner
WORKDIR /app

COPY . .

RUN addgroup -S kinnetic && adduser -S kinnetic -G kinnetic \
	&& chown -R kinnetic:kinnetic /app

USER kinnetic

WORKDIR /app/apps/api

ENV NODE_ENV=production
EXPOSE 3001

# apps/api/index.ts exports `{ port, fetch }` — Bun's native server picks
# that up directly, no build/bundle step needed.
CMD ["bun", "run", "index.ts"]
