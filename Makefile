.DEFAULT_GOAL: build

NPM_BIN 		:= $(shell yarn bin)
BUILD_DIR		:= $(shell pwd)/dist
INFRA_DIR		:= $(shell pwd)/infra

.PHONY: setup
setup:
	@$(MAKE) install.yarn

.PHONY: install.yarn
install.yarn:
	yarn --frozen-lockfile --immutable

.PHONY: clean
clean:
	@rm -rf dist
	@rm -rf .astro

.PHONY: dev
dev:
	@yarn dev

.PHONY: check
check:
	@yarn astro check
	# $(MAKE) check.types
	$(MAKE) check.lint
	$(MAKE) check.infra

.PHONY: check.types
check.types:
	yarn tsc --noEmit

.PHONY: check.lint
check.lint:
	yarn eslint . --ext .ts --ext .tsx --ext .js --ext .json --ignore-path .gitignore

.PHONY: check.infra
check.infra:
	cd ${INFRA_DIR} && \
		terraform fmt -check

.PHONY: build
build:
	@yarn build

.PHONY: preview
preview: build
	@yarn preview

.PHONY: deploy
deploy:
	@yarn workspace @nvd.codes/s3-deploy execute --bucket nvd.codes --directory ${BUILD_DIR}

.PHONY: infra.init
infra.init:
	cd ${INFRA_DIR} && \
		terraform init && \
		terraform validate
