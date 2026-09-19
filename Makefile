.PHONY: dev build lint format check web api 

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