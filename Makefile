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
IMAGES_PROJECT	:= $(ROOT)/apps/images
WEB_PROJECT 	:= $(ROOT)/apps/web

.PHONY: install
install:
	@$(MAKE) install.yarn install.pulumi

.PHONY: install.yarn
install.yarn:
	yarn --frozen-lockfile

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
	$(NPM_BIN)/tsc -p $(BLOG_PROJECT) --noEmit
	$(NPM_BIN)/tsc -p $(IMAGES_PROJECT) --noEmit
	$(NPM_BIN)/tsc -p $(WEB_PROJECT) --noEmit
	yarn eslint . --ext .ts --ext .tsx --ext .js --ext .json --ignore-path .gitignore

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
	yarn workspace @nvd.codes/http tsc
	yarn workspace @nvd.codes/utils tsc

.PHONY: build
build: clean build.libs
	yarn workspace @nvd.codes/api build
	yarn workspace @nvd.codes/blog build
	yarn workspace @nvd.codes/images build
	yarn workspace @nvd.codes/web build

.PHONY: build.docker
build.docker:
	$(MAKE) build.api
	$(MAKE) build.blog
	$(MAKE) build.images
	$(MAKE) build.web

.PHONY: build.api
build.api: COMMIT_SHA=$(shell git log -1 --pretty=format:"%H")
build.api:
	docker buildx build --platform linux/arm64 -f apps/api/Dockerfile -t eu-amsterdam-1.ocir.io/axpksneljs3y/nvd-codes/api:${COMMIT_SHA} --push .

.PHONY: build.blog
build.blog: COMMIT_SHA=$(shell git log -1 --pretty=format:"%H")
build.blog:
	# docker build -f apps/blog/Dockerfile -t eu-amsterdam-1.ocir.io/axpksneljs3y/nvd-codes/blog:${COMMIT_SHA} .
	docker buildx build --platform linux/arm64 -f apps/blog/Dockerfile -t eu-amsterdam-1.ocir.io/axpksneljs3y/nvd-codes/blog:${COMMIT_SHA} --push .

.PHONY: build.images
build.images: COMMIT_SHA=$(shell git log -1 --pretty=format:"%H")
build.images:
	docker buildx build --platform linux/arm64 -f apps/images/Dockerfile -t eu-amsterdam-1.ocir.io/axpksneljs3y/nvd-codes/images:${COMMIT_SHA} --push .

.PHONY: build.web
build.web: COMMIT_SHA=$(shell git log -1 --pretty=format:"%H")
build.web:
	docker buildx build --platform linux/arm64 -f apps/web/Dockerfile -t eu-amsterdam-1.ocir.io/axpksneljs3y/nvd-codes/web:${COMMIT_SHA} --push .
