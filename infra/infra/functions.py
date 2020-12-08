from pulumi import asset, export, Output, Config
from pulumi_azure import core, appservice, storage, appinsights

from infra.utils import get_sas


def create_images_app(
    resource_group: core.ResourceGroup,
    insights: appinsights.Insights,
    app_source_dir: str,
    config: Config,
    image_storage_connection: str,
    origins=[],
) -> appservice.FunctionApp:
    plan = appservice.Plan(
        "images-app-plan",
        resource_group_name=resource_group.name,
        kind="functionapp",
        reserved=True,
        sku=appservice.PlanSkuArgs(tier="Dynamic", size="Y1",),
    )

    storage_account = storage.Account(
        "imagesappsa",
        resource_group_name=resource_group.name,
        account_kind="StorageV2",
        account_tier="Standard",
        account_replication_type="LRS",
    )

    container = storage.Container(
        "images-app-container",
        storage_account_name=storage_account.name,
        container_access_type="private",
    )

    zip_blob = storage.Blob(
        "images-zip-blob",
        storage_account_name=storage_account.name,
        storage_container_name=container.name,
        type="Block",
        source=asset.AssetArchive({".": asset.FileArchive(app_source_dir)}),
    )

    signed_blob_url = Output.all(
        storage_account.name,
        storage_account.primary_connection_string,
        container.name,
        zip_blob.name,
    ).apply(get_sas)

    return appservice.FunctionApp(
        "images-function-app",
        resource_group_name=resource_group.name,
        app_service_plan_id=plan.id,
        storage_account_name=storage_account.name,
        storage_account_access_key=storage_account.primary_access_key,
        version="~3",
        site_config={
            "cors": {
                "allowedOrigins": origins
                + [
                    "https://functions-staging.azure.com",
                    "https://functions.azure.com",
                    "https://functions-next.azure.com",
                ]
            }
        },
        app_settings={
            "APPINSIGHTS_INSTRUMENTATIONKEY": insights.instrumentation_key,
            "FUNCTIONS_WORKER_RUNTIME": "node",
            "AZURE_STORAGE_CONNECTION_STRING": image_storage_connection,
            "IMAGES_CONTAINER": "$web",
            "WEBSITE_RUN_FROM_PACKAGE": signed_blob_url,
            "WEBSITE_NODE_DEFAULT_VERSION": "~12",
        },
        os_type="linux",
    )


def create_api_app(
    resource_group: core.ResourceGroup,
    insights: appinsights.Insights,
    app_source_dir: str,
    config: Config,
    origins=[],
) -> appservice.FunctionApp:
    plan = appservice.Plan(
        "api-app-plan",
        resource_group_name=resource_group.name,
        kind="functionapp",
        reserved=True,
        sku=appservice.PlanSkuArgs(tier="Dynamic", size="Y1",),
    )

    api_storage_account = storage.Account(
        "apiappsa",
        resource_group_name=resource_group.name,
        account_kind="StorageV2",
        account_tier="Standard",
        account_replication_type="LRS",
    )

    api_container = storage.Container(
        "api-app-container",
        storage_account_name=api_storage_account.name,
        container_access_type="private",
    )

    zip_blob = storage.Blob(
        "api-zip-blob",
        storage_account_name=api_storage_account.name,
        storage_container_name=api_container.name,
        type="Block",
        source=asset.AssetArchive({".": asset.FileArchive(app_source_dir)}),
    )

    signed_blob_url = Output.all(
        api_storage_account.name,
        api_storage_account.primary_connection_string,
        api_container.name,
        zip_blob.name,
    ).apply(get_sas)

    return appservice.FunctionApp(
        "api-function-app",
        resource_group_name=resource_group.name,
        app_service_plan_id=plan.id,
        storage_account_name=api_storage_account.name,
        storage_account_access_key=api_storage_account.primary_access_key,
        version="~3",
        site_config={
            "cors": {
                "allowedOrigins": origins
                + [
                    "https://functions-staging.azure.com",
                    "https://functions.azure.com",
                    "https://functions-next.azure.com",
                ]
            }
        },
        app_settings={
            "APPINSIGHTS_INSTRUMENTATIONKEY": insights.instrumentation_key,
            "FUNCTIONS_WORKER_RUNTIME": "node",
            "GITHUB_TOKEN": config.require("github_token"),
            "ISSUE_QUERY": "user:nickvdyck repo:nvd.codes state:open label:comment",
            "WEBSITE_RUN_FROM_PACKAGE": signed_blob_url,
            "WEBSITE_NODE_DEFAULT_VERSION": "~12",
        },
        os_type="linux",
    )