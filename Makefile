.DEFAULT_GOAL: build

NPM_BIN 		:= $(shell yarn bin)
BUILD_DIR		:= $(shell pwd)/.dist

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
	@rm -rf .dist

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

.PHONY: build.apps
build.apps:
	@find . -name 'package.json' -path '*/apps/*' -not -path '*/node_modules/*' -not -path '*/apps/web/*' | sed "s/\.\///" | \
		xargs -n 1 dirname | grep -v "\." | xargs -n 1 -I% -P8 bash -c 'cd % && yarn build'

.PHONY: build.web
build.web:
	@yarn concurrently --names blog,web \
		--prefix-colors red,cyan --success command-web \
		--kill-others \
		"$(MAKE) dev.blog" "yarn workspace @nvd.codes/web build"
	@mkdir -p ${BUILD_DIR}
	@cp -r apps/web/out/* ${BUILD_DIR}
	@cp -r _posts ${BUILD_DIR}

.PHONY: build
build: clean build.libs build.apps build.web

.PHONY: deploy
deploy:
	@yarn workspace @nvd.codes/s3-deploy execute --bucket nvd.codes --directory ${BUILD_DIR}
