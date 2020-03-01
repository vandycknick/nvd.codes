ROOT	:= $(shell pwd)

dev:
	yarn --cwd packages/nvd-codes develop

build:
	yarn --cwd packages/nvd-codes build

serve:
	yarn --cwd packages/nvd-codes serve

clean:
	yarn --cwd packages/nvd-codes clean

infra-preview:
	cd packages/infra && \
		pipenv run \
			pulumi preview

infra-output:
	cd packages/infra && \
		pipenv run \
			pulumi stack output --json

deploy: build
	cd packages/infra && \
		pipenv run \
			pulumi stack output --json | \
			jq -r '.www_storage_connection_string' | \
			dotnet run -p $(ROOT)/tools/AzureStaticFilesUploader -- --cwd $(ROOT)/packages/nvd-codes/public
