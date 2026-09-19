# Usage on the server (one folder per environment, e.g.
# /var/www/kinnetics-staging and /var/www/kinnetics-prod — each with its
# own .env copied from .env.example):
#
#   make deploy STACK=kinnetics-staging IMAGE_API=ghcr.io/OWNER/REPO-api IMAGE_WEB=ghcr.io/OWNER/REPO-web TAG=<sha>
#   make update STACK=kinnetics-staging IMAGE_API=ghcr.io/OWNER/REPO-api IMAGE_WEB=ghcr.io/OWNER/REPO-web TAG=<sha>
#   make destroy STACK=kinnetics-staging
#
# `deploy` does a full `docker stack deploy` (needed the first time, or
# whenever docker-compose.swarm.yaml itself changes — ports, env_file,
# replica count, etc). `update` is the fast path CI uses on every push:
# pull the new tag and force both services to roll onto it, without
# touching the rest of the stack. This mirrors the plain
# `docker pull && docker service update --force --image ...` pattern.

STACK      ?= kinnetics-staging
COMPOSE    ?= docker-compose.swarm.yaml
IMAGE_API  ?= ghcr.io/CHANGE_ME/kinnetics-api
IMAGE_WEB  ?= ghcr.io/CHANGE_ME/kinnetics-web
TAG        ?= latest

.PHONY: deploy destroy update

deploy:
	IMAGE_API=$(IMAGE_API) IMAGE_WEB=$(IMAGE_WEB) TAG=$(TAG) \
		docker stack deploy -c $(COMPOSE) $(STACK)

destroy:
	docker stack rm $(STACK)

update:
	docker pull $(IMAGE_API):$(TAG)
	docker pull $(IMAGE_WEB):$(TAG)
	docker service update --force --image $(IMAGE_API):$(TAG) $(STACK)_api
	docker service update --force --image $(IMAGE_WEB):$(TAG) $(STACK)_web
