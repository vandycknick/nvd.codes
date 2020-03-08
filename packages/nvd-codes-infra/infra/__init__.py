from os import path, environ
from pathlib import Path

from pulumi import Config, export, FileArchive, Output
from pulumi_azure import core, cdn, storage, appservice

from infra.api.project import create_project_api
from infra.api.proxy import create_proxy
from infra.resources import StorageStaticWebsite
from infra.cloudflare import create_dns_record

config = Config(name="nvd-codes-infra")

current_file_path = path.dirname(path.realpath(__file__))
project_api_fallback = Path(
    current_file_path,
    "../../projects-api/.build/bin/ProjectsApi/Release/netcoreapp3.1/publish",
).resolve()
proxy_fallback = Path(current_file_path, "../../proxy").resolve()


def setup():
    project_api_dir = environ.get("PROJECT_API_FOLDER", str(project_api_fallback))
    proxy_dir = environ.get("PROXY_FOLDER", str(proxy_fallback))

    resource_group = core.ResourceGroup("nvd-codes-rg")

    www_storage_account = storage.Account(
        "wwwsa",
        resource_group_name=resource_group.name,
        account_replication_type="LRS",
        account_tier="Standard",
        account_kind="StorageV2",
    )

    static_website = StorageStaticWebsite(
        "www-static", account_name=www_storage_account.name
    )

    www_cdn = cdn.Profile(
        "www-cdn", resource_group_name=resource_group.name, sku="Standard_Microsoft"
    )

    www_endpoint = cdn.Endpoint(
        "www-cdn-ep",
        resource_group_name=resource_group.name,
        profile_name=www_cdn.name,
        origin_host_header=static_website.hostname,
        origins=[{"name": "blobstorage", "hostName": static_website.hostname}],
    )

    api_plan = appservice.Plan(
        "api-plan",
        resource_group_name=resource_group.name,
        kind="FunctionApp",
        sku={"tier": "Dynamic", "size": "Y1"},
    )

    project_api = create_project_api(resource_group, api_plan, project_api_dir, config)
    proxy = create_proxy(resource_group, api_plan, project_api, proxy_dir, config)

    domain = config.require("domain")
    env = config.get("environment") or ""
    zone_id = config.require("zone_id")

    www_dns_record = create_dns_record(
        env, domain, zone_id, www_endpoint.host_name, "cdnverify"
    )
    api_dns_record = create_dns_record(
        "api" if env == "" else f"api-{env}",
        domain,
        zone_id,
        proxy.app.default_hostname,
    )

    domain = config.require("domain")
    proxy_host_binding = appservice.CustomHostnameBinding(
        "proxy-host-binding",
        resource_group_name=resource_group.name,
        app_service_name=proxy.app.name,
        hostname=Output.concat(api_dns_record.main.name, ".", domain),
    )

    export("www_cdn_endpoint", www_endpoint.host_name)
    export("www_storage_account", www_storage_account.name)
    export(
        "www_storage_connection_string", www_storage_account.primary_connection_string
    )

