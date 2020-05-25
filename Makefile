.DEFAULT_GOAL: build

ROOT	:= $(shell pwd)
NPM_BIN := $(shell yarn bin)

INFRA	:= $(ROOT)/infra
API_PROJECT := $(ROOT)/src/api
WEB_PROJECT := $(ROOT)/src/web

.PHONY: install
install:
	yarn --frozen-lockfile

.PHONY: clean
clean:
	@rm -rf {src,libs}/*/.dist || true
	@rm -rf **/*.log || true

.PHONY: dev
dev:
	@yarn concurrently -n web,api -c red,cyan "$(MAKE) dev-web" "$(MAKE) dev-api"

.PHONY: dev-web
dev-web:
	@yarn workspace web dev

.PHONY: dev-api
dev-api:
	@yarn concurrently -n dev,watch "yarn workspace api dev" "yarn workspace api watch"

.PHONY: check
check:
	$(NPM_BIN)/tsc -p $(API_PROJECT) --noEmit
	$(NPM_BIN)/tsc -p $(WEB_PROJECT) --noEmit
	$(NPM_BIN)/eslint . --ext .ts --ext .tsx --ext .js --ext .json --ignore-path .gitignore

.PHONY: build
build: clean
	yarn workspace web build
	yarn workspace api build

.PHONY: pulumi-preview
pulumi-preview:
	cd $(INFRA) && \
		pipenv run \
			pulumi preview

.PHONY: pulumi-up
pulumi-up:
	cd $(INFRA) && \
		pipenv run \
			pulumi up --yes --suppress-outputs

.PHONY: deploy
deploy:
	@echo ""
	@echo "\033[0;32mDeploying Assets \033[0m"
	@echo "\033[0;32m------------------- \033[0m"
	@cd $(INFRA) && \
			(pipenv run pulumi stack output -s prod --json | \
			jq -r '.web_app_connection_string' | \
			pipenv run python infra/upload.py --container '$$web' --cwd $(ROOT)/src/web/.dist)
