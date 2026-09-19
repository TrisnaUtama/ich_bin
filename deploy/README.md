# Deploying ZineForge (kinnetics)

Two images come out of CI: `ghcr.io/<owner>/kinnetics-api` (Bun + Hono)
and `ghcr.io/<owner>/kinnetics-web` (static build served by nginx, with
its `VITE_*` config injected at container start — same image works for
every environment, see `apps/web/src/lib/env.ts`).

## One-time GitHub setup

1. **Push this repo to GitHub** (if it isn't already) and create a
   `staging` branch — that's what the pipeline treats as the
   testing/development deploy target. `main` is production.
2. **Repo secrets** (Settings → Secrets and variables → Actions →
   Secrets):
   - `DEPLOY_HOST` — the homelab server's address.
   - `DEPLOY_USER` — SSH user (needs `docker` group membership, no sudo
     needed for `docker` commands).
   - `DEPLOY_SSH_KEY` — private key for that user. Generate a dedicated
     deploy key (`ssh-keygen -t ed25519 -f deploy_key -C "gh-actions"`),
     put the public half in the server's `~/.ssh/authorized_keys`, and
     paste the private half here.
   No GHCR credentials needed — the workflow authenticates with the
   automatic `GITHUB_TOKEN`.
3. **Repo variables** (same page, "Variables" tab) — optional, only
   needed if your deploy folders aren't at the default paths below:
   - `STAGING_DEPLOY_PATH` (default `/var/www/kinnetics-staging`)
   - `PRODUCTION_DEPLOY_PATH` (default `/var/www/kinnetics-prod`)
   - `STAGING_URL` / `PRODUCTION_URL` — cosmetic, shown as a link on the
     deployment in GitHub's UI.
4. **GitHub Environments** (Settings → Environments) — create `staging`
   and `production`. For `production`, add yourself as a required
   reviewer so a push to `main` pauses for manual approval before it
   touches the real server — that's the easiest way to keep "prod later"
   true even once `main` starts moving. `staging` can stay unprotected
   so it deploys automatically.
5. **`GITHUB_TOKEN` package permissions** — Settings → Actions → General
   → Workflow permissions → "Read and write permissions", so the
   workflow is allowed to push to GHCR.
6. Make the packages public (or grant the server's pull access) once the
   first images exist: package Settings → Change visibility, for both
   `kinnetics-api` and `kinnetics-web`. Otherwise `docker pull` on the
   server needs `docker login ghcr.io` with a PAT that has `read:packages`.

## One-time server setup (per environment)

Repeat for `/var/www/kinnetics-staging` and, later, `/var/www/kinnetics-prod`:

```sh
mkdir -p /var/www/kinnetics-staging
cd /var/www/kinnetics-staging
# copy docker-compose.swarm.yaml, Makefile and .env.example from this
# deploy/ folder into here (scp, git clone --sparse, whatever's easiest)
cp .env.example .env
vim .env   # fill in real DB credentials, JWT secret, CORS_ORIGIN, VITE_* etc.

# first deploy — creates the stack, uses whatever image tag you pass
make deploy \
  IMAGE_API=ghcr.io/<owner>/kinnetics-api \
  IMAGE_WEB=ghcr.io/<owner>/kinnetics-web \
  TAG=<a-tag-that-already-exists-in-ghcr>
```

After that, every push to `staging` (or `main`, once you're ready) runs
`make update` over SSH automatically — same `docker pull` +
`docker service update --force --image` pattern as yonstrans-api, just
for two services instead of one. `make deploy` is only needed again if
`docker-compose.swarm.yaml` itself changes (ports, replicas, env_file).

## Local sanity-check before relying on CI

```sh
# from the repo root
docker build -f apps/api/Dockerfile -t kinnetics-api:local .
docker build -f apps/web/Dockerfile -t kinnetics-web:local .

docker run --rm -p 3001:3001 --env-file apps/api/.env kinnetics-api:local
docker run --rm -p 8080:80 \
  -e VITE_API_BASE_URL=http://localhost:3001 \
  -e VITE_GOOGLE_CLIENT_ID=your-client-id \
  kinnetics-web:local
```

## Database migrations

Nothing in the pipeline runs `drizzle-kit migrate` automatically — same
as the existing workflow, run it by hand against the target DB when a
migration needs applying:

```sh
DB_HOST=... DB_PORT=... DB_USERNAME=... DB_PASSWORD=... DB_NAME=... \
  bunx drizzle-kit migrate --config packages/db/drizzle.config.ts
```

(or SSH in and `docker run --rm --env-file .env ghcr.io/<owner>/kinnetics-api:<tag> bunx drizzle-kit migrate` from `/app/packages/db` inside the image, if you'd rather not need a local DB connection).
