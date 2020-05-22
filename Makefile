.PHONY: clean dev build serve
.DEFAULT_GOAL: build

ROOT	:= $(shell pwd)
INFRA	:= $(ROOT)/infra
NPM_BIN := $(shell yarn bin)

.PHONY: dev
dev:
	GATSBY_PROJECT_API=https://api.nvd.codes $(NPM_BIN)/gatsby develop

.PHONY: check
check:
	${NPM_BIN}/tsc --noEmit
	$(NPM_BIN)/eslint . --ext .ts --ext .tsx --ext .js --ext .json --ignore-path .gitignore

.PHONY: build
build:
	yarn build

.PHONY: serve
serve:
	${NPM_BIN}/gatsby serve

.PHONY: clean
clean:
	$(NPM_BIN)/gatsby clean
	rm -rf .build
	rm -rf functions/ProjectsApi/bin
	rm -rf functions/ProjectsApi/obj
	rm -rf functions/Proxy/bin
	rm -rf functions/Proxy/obj

.PHONY: infra-up
infra-up:
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
			pipenv run python infra/upload.py --container '$$web' --cwd $(ROOT)/src/web/out)
