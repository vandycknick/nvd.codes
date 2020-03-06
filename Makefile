.PHONY: clean dev build serve
.DEFAULT_GOAL: build

ROOT	:= $(shell pwd)
INFRA	:= $(ROOT)/packages/nvd-codes-infra

dev:
	CONTENT_FOLDER=$(shell pwd)/content \
	yarn --cwd packages/nvd-codes develop

build:
	CONTENT_FOLDER=$(shell pwd)/content \
	yarn --cwd packages/nvd-codes build

serve:
	yarn --cwd packages/nvd-codes serve

clean:
	yarn --cwd packages/nvd-codes clean

infra-up:
	cd $(INFRA) && \
		pipenv run \
			pulumi up --yes --suppress-outputs

infra-preview:
	cd $(INFRA) && \
		pipenv run \
			pulumi preview

infra-output:
	cd $(INFRA) && \
		pipenv run \
			pulumi stack output --json

deploy: clean build
	cd $(INFRA) && \
		pipenv run \
			pulumi stack output --json | \
			jq -r '.www_storage_connection_string' | \
			dotnet run -p $(ROOT)/tools/AzureStaticFilesUploader -- --cwd $(ROOT)/packages/nvd-codes/public
