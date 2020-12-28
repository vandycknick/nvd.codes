from pulumi import Config, export, FileArchive, Output
from pulumi_azure import appinsights, appservice, cdn, core, storage, keyvault
from pulumi_azuread import get_service_principal
from pulumi_cloudflare import Record

from apps import create_api_app, create_images_app, create_cert_bot_app
from utils.cloudflare import create_cname_record
from utils.config import get_config

config = get_config()
current = core.get_client_config()

resource_group = core.ResourceGroup("nvd-codes")

cdn_sp = get_service_principal(display_name="Microsoft.Azure.Cdn")

key_vault = keyvault.KeyVault(
    "keyvault",
    tenant_id=current.tenant_id,
    resource_group_name=resource_group.name,
    location=resource_group.location,
    sku_name="standard",
    soft_delete_enabled=True,
    soft_delete_retention_days=7,
    purge_protection_enabled=False,
    access_policies=[
        keyvault.KeyVaultAccessPolicyArgs(
            tenant_id=current.tenant_id,
            object_id=current.object_id,
            key_permissions=["get", "list"],
            secret_permissions=["get", "list", "set"],
            storage_permissions=["get"],
            certificate_permissions=["get", "list"],
        ),
        keyvault.KeyVaultAccessPolicyArgs(
            tenant_id=current.tenant_id,
            object_id=cdn_sp.object_id,
            key_permissions=[],
            secret_permissions=["get", "list"],
            certificate_permissions=["get", "list"],
        ),
    ],
)

app_insights = appinsights.Insights(
    "function-app-insights",
    resource_group_name=resource_group.name,
    location=resource_group.location,
    application_type="web",
)

web_app_storage_account = storage.Account(
    "webappsa",
    resource_group_name=resource_group.name,
    account_tier="Standard",
    account_kind="StorageV2",
    account_replication_type="LRS",
    enable_https_traffic_only=True,
    min_tls_version="TLS1_2",
    static_website={"indexDocument": "index.html",},
)

resume_app_storage_account = storage.Account(
    "resumesa",
    resource_group_name=resource_group.name,
    account_tier="Standard",
    account_kind="StorageV2",
    account_replication_type="LRS",
    enable_https_traffic_only=True,
    min_tls_version="TLS1_2",
    static_website={"indexDocument": "index.html",},
)

web_cdn = cdn.Profile(
    "web-cdn", resource_group_name=resource_group.name, sku="Standard_Microsoft"
)

web_cdn_endpoint = cdn.Endpoint(
    "web-cdn-endpoint",
    resource_group_name=resource_group.name,
    profile_name=web_cdn.name,
    origin_host_header=web_app_storage_account.primary_web_host,
    origins=[
        cdn.EndpointOriginArgs(
            name="blobstorage", host_name=web_app_storage_account.primary_web_host
        )
    ],
    global_delivery_rule={
        "modify_response_header_action": [
            # CSP header not configured due to issue with rule value length that has a max of 100 chars
            {
                "action": "Overwrite",
                "name": "Feature-Policy",
                "value": "accelerometer 'none'; camera 'none'; geolocation 'none'; gyroscope 'none'; microphone 'none';",
            },
            {
                "action": "Overwrite",
                "name": "Referrer-Policy",
                "value": "strict-origin-when-cross-origin",
            },
            {
                "action": "Overwrite",
                "name": "Strict-Transport-Security",
                "value": "max-age=31536000; includeSubDomains",
            },
            {"action": "Overwrite", "name": "X-Frame-Options", "value": "SAMEORIGIN"},
            {
                "action": "Overwrite",
                "name": "X-Content-Type-Options",
                "value": "nosniff",
            },
            # Can't apply this yet because of 100 chars limit
            #  {
            #     "action": "Overwrite",
            #     "name": "Report-To",
            #     "value": json.dumps({"group":"default","max_age":10886400,"endpoints":[{"url":"https://nvdcodes.report-uri.com/a/d/g"}],"include_subdomains":True})
            # },
        ]
    },
)

resume_cdn = cdn.Profile(
    "resume-cdn", resource_group_name=resource_group.name, sku="Standard_Microsoft"
)

resume_cdn_endpoint = cdn.Endpoint(
    "resume-cdn-ep",
    resource_group_name=resource_group.name,
    profile_name=resume_cdn.name,
    origin_host_header=resume_app_storage_account.primary_web_host,
    origins=[
        cdn.EndpointOriginArgs(
            name="blobstorage", host_name=resume_app_storage_account.primary_web_host
        )
    ],
)

cdn_profile = cdn.Profile(
    "cdn-profile", resource_group_name=resource_group.name, sku="Standard_Microsoft"
)

api_app = create_api_app(
    resource_group=resource_group,
    insights=app_insights,
    key_vault=key_vault,
    origins=[
        Output.concat("https://", web_cdn_endpoint.host_name),
        "https://nvd.codes",
        "https://www.nvd.codes",
    ],
)

images_app = create_images_app(
    resource_group=resource_group,
    insights=app_insights,
    key_vault=key_vault,
    origins=[
        Output.concat("https://", web_cdn_endpoint.host_name),
        "https://nvd.codes",
        "https://www.nvd.codes",
    ],
    image_storage_connection=web_app_storage_account.primary_connection_string,
)

cert_bot_app = create_cert_bot_app(
    resource_group=resource_group,
    insights=app_insights,
    key_vault=key_vault,
    origins=[],
)

images_cdn_endpoint = cdn.Endpoint(
    "images-cdn-ep",
    resource_group_name=resource_group.name,
    profile_name=cdn_profile.name,
    origin_host_header=images_app.default_hostname,
    origins=[
        cdn.EndpointOriginArgs(
            name=images_app.default_hostname.apply(lambda h: h.replace(".", "-")),
            host_name=images_app.default_hostname,
        )
    ],
    querystring_caching_behaviour="UseQueryString",
)

domain = config.require("domain")
zone_id = config.require("zone_id")
proxied = config.require_bool("dns_proxied")

web_dns_record = create_cname_record(
    name=None, zone_id=zone_id, value="www.nvd.codes", proxied=True
)

www_dns_record = create_cname_record(
    name="www", zone_id=zone_id, value=web_cdn_endpoint.host_name, proxied=proxied
)

resume_dns_record = create_cname_record(
    name="resume",
    zone_id=zone_id,
    value=resume_cdn_endpoint.host_name,
    proxied=proxied,
)

api_dns_record = create_cname_record(
    name="api", zone_id=zone_id, value=api_app.default_hostname, proxied=proxied
)

images_dns_record = create_cname_record(
    name="images", zone_id=zone_id, value=images_cdn_endpoint.host_name, proxied=proxied
)

# api_host_binding = appservice.CustomHostnameBinding(
#     "api-host-binding",
#     resource_group_name=resource_group.name,
#     app_service_name=api_app.name,
#     hostname=api_dns_record.name,
# )

export("web_app_name", web_app_storage_account.name)
export("api_app_name", api_app.name)

export("web_cdn_endpoint", web_cdn_endpoint.host_name)

export("web_app_connection_string", web_app_storage_account.primary_connection_string)
export(
    "resume_app_connection_string", resume_app_storage_account.primary_connection_string
)
