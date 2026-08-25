# docker/common/Dockerfile.base を先にビルドしてから
# dev / prod の compose を動かすためのショートカット。

BASE_IMAGE := myapp-base:local

.PHONY: base dev dev-build dev-down dev-logs prod prod-build prod-down prod-logs

base:
	docker build -f docker/common/Dockerfile.base -t $(BASE_IMAGE) ./app

dev-build: base
	docker compose -f docker/dev/compose.yaml --env-file docker/dev/.env build

dev: base
	docker compose -f docker/dev/compose.yaml --env-file docker/dev/.env up

dev-down:
	docker compose -f docker/dev/compose.yaml --env-file docker/dev/.env down

dev-logs:
	docker compose -f docker/dev/compose.yaml --env-file docker/dev/.env logs -f

prod-build: base
	docker compose -f docker/prod/compose.yaml --env-file docker/prod/.env build

prod: base
	docker compose -f docker/prod/compose.yaml --env-file docker/prod/.env up -d --build

prod-down:
	docker compose -f docker/prod/compose.yaml --env-file docker/prod/.env down

prod-logs:
	docker compose -f docker/prod/compose.yaml --env-file docker/prod/.env logs -f
