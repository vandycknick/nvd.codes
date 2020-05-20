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
    current_file_path, "../../.build/bin/ProjectsApi/Release/netcoreapp3.1/publish",
).resolve()
proxy_fallback = Path(
    current_file_path, "../../.build/bin/Proxy/Release/netcoreapp3.1/publish"
).resolve()


def setup():
    project_api_dir = environ.get("PROJECT_API_FOLDER", str(project_api_fallback))
    proxy_dir = environ.get("PROXY_FOLDER", str(proxy_fallback))

    resource_group = core.ResourceGroup("nvd-codes")

    www_storage_account = storage.Account(
        "wwwsa",
        resource_group_name=resource_group.name,
        account_replication_type="LRS",
        account_tier="Standard",
        account_kind="StorageV2",
        enable_https_traffic_only=False,
        static_website={"indexDocument": "index.html",},
    )

    www_cdn = cdn.Profile(
        "www-cdn", resource_group_name=resource_group.name, sku="Standard_Microsoft"
    )

    www_endpoint = cdn.Endpoint(
        "www-cdn-ep",
        resource_group_name=resource_group.name,
        profile_name=www_cdn.name,
        origin_host_header=www_storage_account.primary_web_host,
        origins=[{"name": "blobstorage", "hostName": www_storage_account.primary_web_host}],
        global_delivery_rule={
            "modify_response_header_action": [
                # CSP header not configured due to issue with rule value length that has a max of 100 chars
                { "action": "Overwrite", "name": "Feature-Policy", "value": "accelerometer 'none'; camera 'none'; geolocation 'none'; gyroscope 'none'; microphone 'none';˝" },
                { "action": "Overwrite", "name": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
                { "action": "Overwrite", "name": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains" },
                { "action": "Overwrite", "name": "X-Frame-Options", "value": "SAMEORIGIN" },
                { "action": "Overwrite", "name": "X-Content-Type-Options", "value": "nosniff" },
                # Can't apply this yet because of 100 chars limit
                #  {
                #     "action": "Overwrite",
                #     "name": "Report-To",
                #     "value": json.dumps({"group":"default","max_age":10886400,"endpoints":[{"url":"https://nvdcodes.report-uri.com/a/d/g"}],"include_subdomains":True})
                # },
            ]
        }
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
