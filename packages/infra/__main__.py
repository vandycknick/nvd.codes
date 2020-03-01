from pulumi import Config, export, FileArchive
from pulumi_azure import core, cdn, storage
from resources import StorageStaticWebsite

config = Config(name="nvd.codes")

location = "westeurope"
public = "../nvd-codes/public"

resource_group = core.ResourceGroup("nvd-codes-rg", location=location)

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

export("www_cdn_endpoint", www_endpoint.host_name)
export("www_storage_account", www_storage_account.name)
export("www_storage_connection_string", www_storage_account.primary_connection_string)
