import os

from pathlib import Path
from pulumi import asset, export, Output, Config
from pulumi_azure import core, storage, appservice

from infra.utils import get_sas
from infra.api.project import ProjectApi

current_file_path = os.path.dirname(os.path.realpath(__file__))


class Proxy:
    def __init__(self, app: appservice.FunctionApp):
        self.app = app


def create_proxy(
    resource_group: core.ResourceGroup,
    plan: appservice.Plan,
    project_api: ProjectApi,
    config: Config,
):
    proxy_storage_account = storage.Account(
        "proxysa",
        resource_group_name=resource_group.name,
        account_kind="StorageV2",
        account_tier="Standard",
        account_replication_type="LRS",
    )

    proxy_container = storage.Container(
        "proxy-container",
        storage_account_name=proxy_storage_account.name,
        container_access_type="private",
    )

    proxy_folder = Path(current_file_path, "../../../proxy/proxies.json",).resolve()
    zip_blob = storage.ZipBlob(
        "proxy-zipblob",
        storage_account_name=proxy_storage_account.name,
        storage_container_name=proxy_container.name,
        type="block",
        content=asset.AssetArchive(
            {"proxies.json": asset.FileAsset(str(proxy_folder))}
        ),
    )

    signed_blob_url = Output.all(
        proxy_storage_account.name,
        proxy_storage_account.primary_connection_string,
        proxy_container.name,
        zip_blob.name,
    ).apply(get_sas)

    proxy_function_app = appservice.FunctionApp(
        "proxy-function-app",
        resource_group_name=resource_group.name,
        app_service_plan_id=plan.id,
        storage_connection_string=proxy_storage_account.primary_connection_string,
        version="~3",
        site_config={
            "cors": {
                "allowedOrigins": ["https://staging.nvd.codes", "https://nvd.codes"]
            }
        },
        app_settings={
            "AZURE_FUNCTION_PROXY_DISABLE_LOCAL_CALL": True,
            "FUNCTIONS_WORKER_RUNTIME": "dotnet",
            "PROJECT_API": Output.concat("https://", project_api.app.default_hostname),
            "WEBSITE_RUN_FROM_PACKAGE": signed_blob_url,
        },
    )

    return Proxy(proxy_function_app)
