.DEFAULT_GOAL: build

NPM_BIN 		:= $(shell yarn bin)
NODE_VERSION	:= 16.14.2
PUSH_IMAGES		?= false

ifeq ($(PUSH_IMAGES),true)
	BUILDX_ARGS = --push
endif

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
	@rm -rf apps/*/.tmp
	@rm -rf libs/*/.dist
	@rm -rf **/*.log

.PHONY: dev
dev: build.libs
	@yarn concurrently -n blog,web -c red,cyan "$(MAKE) dev.blog" "$(MAKE) dev.web"

.PHONY: dev.blog
dev.blog:
	@yarn workspace @nvd.codes/blog dev

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

.PHONY: build.libs
build.libs:
	@find . -name 'package.json' -path '*/libs/*' -not -path '*/node_modules/*' | sed "s/\.\///" | \
		xargs -n 1 dirname | grep -v "\." | xargs -n 1 -I% -P2 bash -c 'cd % && yarn tsc'

.PHONY: build.web
build.web:
	@yarn concurrently -n blog,web -c red,cyan "$(MAKE) dev.blog" "yarn workspace @nvd.codes/web build"
	yarn workspace @nvd.codes/web build

.PHONY: build
build: clean build.libs build.web
