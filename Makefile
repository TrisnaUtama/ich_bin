.PHONY: dev build lint format check

dev:
	moon run :dev

build:
	moon run :build

lint:
	bunx biome lint .

format:
	bunx biome format --write .

check:
	bunx biome check --write .