.PHONY: clean dev build serve
.DEFAULT_GOAL: build

ROOT	:= $(shell pwd)
INFRA	:= $(ROOT)/infra
NPM_BIN := $(shell yarn bin)

dev:
	GATSBY_PROJECT_API=https://api.nvd.codes $(NPM_BIN)/gatsby develop

check:

#   "scripts": {
#     "build": "gatsby build",
#     "clean": "gatsby clean",
#     "develop": "gatsby develop",
#     "format": "prettier --write \"**/*.{js,jsx,json,md}\"",
#     "lint": "eslint --ignore-path .gitignore .",
#     "start": "npm run develop",
#     "serve": "gatsby serve",
#     "type-check": "tsc --noEmit",
#     "test": "echo \"Write tests! -> https://gatsby.dev/unit-testing\" && exit 1"
#   },
	$(NPM_BIN)/eslint . --ext .ts --ext .tsx --ext .js --ext .json --ignore-path .gitignore

build:
	yarn build
	dotnet publish -c Release

serve:
	yarn serve

clean:
	$(NPM_BIN)/gatsby clean
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
