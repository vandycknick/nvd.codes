.DEFAULT_GOAL: build

ROOT		:= $(shell pwd)
NPM_BIN 	:= $(shell yarn bin)

.PHONY: setup
setup:
	@$(MAKE) install.yarn

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
	$(MAKE) check.types
	$(MAKE) check.lint

.PHONY: check.types
check.types:
	@find . -name 'package.json' -not -path '*/node_modules/*' | sed "s/\.\///" | \
		xargs -n 1 dirname | grep -v "\." | xargs -n 1 -I% -P8 bash -c 'cd % && yarn tsc --noEmit'

.PHONY: check.lint
check.lint:
	yarn eslint . --ext .ts --ext .tsx --ext .js --ext .json --ignore-path .gitignore

.PHONY: test.unit
test.unit:
	NODE_ENV=test ${NPM_BIN}/jest --testPathIgnorePatterns '/(.dist|e2e)/'

.PHONY: test.watch
test.watch:
	NODE_ENV=test ${NPM_BIN}/jest --testPathIgnorePatterns '/(.dist|e2e)/' --watch

.PHONY: test.fix
test.fix:
	NODE_ENV=test ${NPM_BIN}/jest --testPathIgnorePatterns '/(.dist|e2e)/' --update-snapshot

.PHONY: build
build: clean
	@find . -name 'package.json' -path '*/libs/*' -not -path '*/node_modules/*' | sed "s/\.\///" | \
		xargs -n 1 dirname | grep -v "\." | xargs -n 1 -I% -P2 bash -c 'cd % && yarn tsc'
	@find . -name 'package.json' -path '*/apps/*' -not -path '*/node_modules/*' | sed "s/\.\///" | \
		xargs -n 1 dirname | grep -v "\." | xargs -n 1 -I% -P8 bash -c 'cd % && yarn build'

.PHONY: build.docker
build.docker: COMMIT_SHA=$(shell git log -1 --pretty=format:"%H")
build.docker:
	$(MAKE) build
	@find . -name 'package.json' -path '*/apps/*' -not -path '*/node_modules/*' | \
		sed "s/\.\///" | xargs -n 1 dirname | grep -v "\." | \
		xargs -n 1 -I% -P1 bash -c 'echo "Building image for %"; docker buildx build --platform linux/arm64 -f %/Dockerfile -t eu-amsterdam-1.ocir.io/axpksneljs3y/nvd-codes/$$(echo % | sed "s/apps\///"):${COMMIT_SHA} --push .'
