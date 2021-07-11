.DEFAULT_GOAL: build

ROOT			:= $(shell pwd)
NPM_BIN 		:= $(shell yarn bin)

WATCH 			:= "0"
WATCH_FLAGS 	:= $(if $(filter-out 1,$(WATCH)), "", "--watch")

FIX 			:= "0"
UPDATE_FLAGS 	:= $(if $(filter-out 1,$(FIX)), "", "--update-snapshot")

INFRA			:= $(ROOT)/infra
API_PROJECT 	:= $(ROOT)/apps/api
BLOG_PROJECT	:= $(ROOT)/apps/blog
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

.PHONY: dev.api
dev.api:
	@yarn workspace @nvd.codes/api dev

.PHONY: dev.blog
dev.blog:
	@yarn workspace @nvd.codes/blog dev

.PHONY: dev.images
dev.images:
	@yarn workspace @nvd.codes/images dev

.PHONY: dev.web
dev.web:
	@yarn workspace @nvd.codes/web dev


.PHONY: check
check:
	$(NPM_BIN)/tsc -p $(API_PROJECT) --noEmit
	$(NPM_BIN)/tsc -p $(WEB_PROJECT) --noEmit
	$(NOM_BIN)/tsc -p $(BLOG_PROJECT) --noEmit
	yarn eslint . --ext .ts --ext .tsx --ext .js --ext .json --ignore-path .gitignore
	yarn workspace @nvd.codes/resume validate

.PHONY: lint.infra
lint.infra:
	@cd infra && pipenv run black --check .

.PHONY: test.unit
test.unit:
	NODE_ENV=test ${NPM_BIN}/jest --testPathIgnorePatterns '/(.dist|e2e)/'

.PHONY: test.watch
test.watch:
	NODE_ENV=test ${NPM_BIN}/jest --testPathIgnorePatterns '/(.dist|e2e)/' --watch

.PHONY: test.fix
test.fix:
	NODE_ENV=test ${NPM_BIN}/jest --testPathIgnorePatterns '/(.dist|e2e)/' --update-snapshot

.PHONY: build.libs
build.libs:
	yarn workspace @nvd.codes/contracts tsc
	yarn workspace @nvd.codes/core tsc
	yarn workspace @nvd.codes/http tsc
	yarn workspace @nvd.codes/monad tsc

.PHONY: build
build: clean build.libs
	yarn workspace @nvd.codes/api build
	yarn workspace @nvd.codes/blog build
	yarn workspace @nvd.codes/images build
	yarn workspace @nvd.codes/web build

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
		(pipenv run pulumi stack output -s prod --json --show-secrets | \
		jq -r '.web_app_connection_string' | \
		pipenv run python utils/upload.py --container '$$web' --cwd $(WEB_PROJECT)/.dist)
	@cd $(INFRA) && \
		(pipenv run pulumi stack output -s prod --json --show-secrets | \
		jq -r '.resume_app_connection_string' | \
		pipenv run python utils/upload.py --container '$$web' --cwd $(RESUME_PROJECT)/.dist)


.PHONY: build.api
build.api: COMMIT_SHA=$(shell git log -1 --pretty=format:"%H")
build.api:
	docker buildx build --platform linux/amd64,linux/arm64 -f apps/api/Dockerfile -t eu-amsterdam-1.ocir.io/axpksneljs3y/nvd-codes/api:${COMMIT_SHA} --push .
