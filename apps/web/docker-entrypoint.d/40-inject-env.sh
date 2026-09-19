#!/bin/sh
# Runs automatically at container start (nginx's own docker-entrypoint.sh
# executes every executable *.sh file under /docker-entrypoint.d/ before
# starting nginx). Regenerates env.js from this container's real env vars
# so the same built image can be deployed to staging/prod with different
# values, without a rebuild.
set -eu

TARGET=/usr/share/nginx/html/env.js

cat <<JS > "$TARGET"
window.__ENV__ = {
  VITE_API_BASE_URL: "${VITE_API_BASE_URL:-}",
  VITE_GOOGLE_CLIENT_ID: "${VITE_GOOGLE_CLIENT_ID:-}"
};
JS

echo "[env] wrote $TARGET"
