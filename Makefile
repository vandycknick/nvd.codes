.DEFAULT_GOAL: build

ROOT			:= $(shell pwd)
NPM_BIN 		:= $(shell yarn bin)

INFRA			:= $(ROOT)/infra
API_PROJECT 	:= $(ROOT)/apps/api
WEB_PROJECT 	:= $(ROOT)/apps/web
RESUME_PROJECT	:= $(ROOT)/apps/resume
RESUME_JSON		:= $(ROOT)/_data/resume.json

.PHONY: install
install:
	@$(MAKE) install.yarn install.pulumi

.PHONY: install.yarn
install.yarn:
	yarn --frozen-lockfile

.PHONY: install.pulumi
install.pulumi:
	cd infra && pipenv install

.PHONY: clean
clean:
	@rm -rf apps/*/.dist
	@rm -rf apps/*/.next
	@rm -rf libs/*/.dist
	@rm -rf **/*.log

.PHONY: dev
dev:
	@yarn concurrently -n web,api -c red,cyan "$(MAKE) dev.web" "$(MAKE) dev.api"

.PHONY: dev.web
dev.web:
	@yarn workspace @nvd.codes/web dev

.PHONY: dev.api
dev.api:
	@yarn concurrently -n dev,watch "yarn workspace @nvd.codes/api dev" "yarn workspace @nvd.codes/api watch"

.PHONY: check
check:
	$(NPM_BIN)/tsc -p $(API_PROJECT) --noEmit
	$(NPM_BIN)/tsc -p $(WEB_PROJECT) --noEmit
	$(NPM_BIN)/eslint . --ext .ts --ext .tsx --ext .js --ext .json --ignore-path .gitignore
	yarn workspace @nvd.codes/resume validate

.PHONY: build.libs
build.libs:
	yarn workspace @nvd.codes/core tsc
	yarn workspace @nvd.codes/config tsc
	yarn workspace jsonresume-theme-nickvd build

.PHONY: build
build: clean build.libs
	yarn workspace @nvd.codes/web build
	yarn workspace @nvd.codes/api build
	yarn workspace @nvd.codes/resume build

.PHONY: pulumi.preview
pulumi.preview:
	cd $(INFRA) && \
		pipenv run \
			pulumi preview --stack prod

.PHONY: pulumi.up
pulumi.up:
	cd $(INFRA) && \
		pipenv run \
			pulumi up --yes --stack prod --suppress-outputs

.PHONY: deploy
deploy:
	@echo ""
	@echo "\033[0;32mDeploying Assets \033[0m"
	@echo "\033[0;32m------------------- \033[0m"
	@cd $(INFRA) && \
		(pipenv run pulumi stack output -s prod --json | \
		jq -r '.web_app_connection_string' | \
		pipenv run python infra/upload.py --container '$$web' --cwd $(WEB_PROJECT)/.dist)
	@cd $(INFRA) && \
		(pipenv run pulumi stack output -s prod --json | \
		jq -r '.resume_app_connection_string' | \
		pipenv run python infra/upload.py --container '$$web' --cwd $(RESUME_PROJECT)/.dist)
