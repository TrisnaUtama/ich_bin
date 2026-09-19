.PHONY: dev build lint format check web api db-new-schema db-generate db-migrate db-push db-studio

dev:
	moon run :dev

web:
	moon run web:dev

api:
	moon run api:dev

build:
	moon run :build

lint:
	bunx biome lint .

format:
	bunx biome format --write .

check:
	bunx biome check --write .

db-new-schema:
	moon run db:new-schema -- $(name)

db-generate:
	moon run db:db-generate

# migrate & push run bunx directly (not through moon) — moon pipes task
# output, which suppresses postgres error details and breaks the
# interactive Yes/No prompt that `push` needs. cd-ing here (instead of
# just passing --config) also makes Bun's auto .env loading pick up
# packages/db/.env correctly.
db-migrate:
	cd packages/db && bunx drizzle-kit migrate

db-push:
	cd packages/db && bunx drizzle-kit push

db-studio:
	moon run db:db-studio
