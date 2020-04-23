.PHONY: clean dev build serve
.DEFAULT_GOAL: build

ROOT	:= $(shell pwd)
INFRA	:= $(ROOT)/infra

dev:
	GATSBY_PROJECT_API=https://api.nvd.codes yarn develop

lint:
	yarn type-check
	yarn lint

build:
	yarn build
	dotnet publish -c Release

serve:
	yarn serve

clean:
	yarn clean
	dotnet clean -c Debug
	dotnet clean -c Release
	rm -rf functions/ProjectsApi/bin
	rm -rf functions/ProjectsApi/obj
	rm -rf functions/Proxy/bin
	rm -rf functions/Proxy/obj

infra-up:
	cd $(INFRA) && \
		pipenv run \
			pulumi up --yes --suppress-outputs

.PHONY: deploy
deploy: clean build
	@echo ""
	@echo "\033[0;32mDeploying Assets \033[0m"
	@echo "\033[0;32m------------------- \033[0m"
	@cd $(INFRA) && \
			(pipenv run pulumi stack output -s prod --json | \
			jq -r '.www_storage_connection_string' | \
			pipenv run python infra/static/upload.py --container '$$web' --cwd $(ROOT)/public)
