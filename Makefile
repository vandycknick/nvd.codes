.DEFAULT_GOAL: build

NPM_BIN 		:= $(shell yarn bin)
BUILD_DIR		:= $(shell pwd)/dist
INFRA_DIR		:= $(shell pwd)/infra

.PHONY: setup
setup:
	@$(MAKE) setup.yarn
	@$(MAKE) install.yarn

.PHONY: setup.yarn
setup.yarn:
	corepack enable
	corepack prepare yarn@stable --activate
	yarn --version
	yarn config get cacheFolder

.PHONY: install.yarn
install.yarn:
	yarn --immutable

.PHONY: clean
clean:
	@rm -rf dist
	@rm -rf .astro

.PHONY: dev
dev:
	@yarn dev

.PHONY: check
check:
	$(MAKE) check.app
	$(MAKE) check.infra

.PHONY: check.types
check.types:
	yarn tsc --noEmit

.PHONY: check.lint
check.lint:
	yarn eslint -c ./eslint.config.js

.PHONY: check.fixlint
check.fixlint:
	yarn eslint . --ext .ts --ext .tsx --ext .js --ext .jsx --ext .mjs --ext .json --ext .astro --ignore-path .gitignore --fix

.PHONY: check.app
check.app:
	@yarn astro check
	$(MAKE) check.types
	$(MAKE) check.lint

.PHONY: check.infra
check.infra:
	cd ${INFRA_DIR} && \
		terraform fmt -check

.PHONY: build
build:
	@yarn build
	@yarn postbuild

.PHONY: preview
preview:
	@yarn preview

.PHONY: deploy
deploy:
	@yarn workspace @nvd.codes/s3-deploy execute --bucket nvd.codes --directory ${BUILD_DIR}

.PHONY: infra.init
infra.init:
	cd ${INFRA_DIR} && \
		terraform init && \
		terraform validate
