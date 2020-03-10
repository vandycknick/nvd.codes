.PHONY: clean dev build serve
.DEFAULT_GOAL: build

ROOT	:= $(shell pwd)
INFRA	:= $(ROOT)/infra

dev:
	yarn develop

lint:
	yarn lint

build:
	yarn build
	dotnet publish -c Release

serve:
	yarn serve

clean:
	yarn clean
	dotnet clean -c Debug
	dotnet clean -c Release
	rm -rf functions/ProjectsApi/bin
	rm -rf functions/ProjectsApi/obj
	rm -rf functions/Proxy/bin
	rm -rf functions/Proxy/obj

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
			dotnet run -p $(ROOT)/tools/AzureStaticFilesUploader -- --cwd $(ROOT)/public
