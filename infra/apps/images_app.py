from pathlib import Path
from pulumi import asset, Output, ResourceOptions, Alias
from pulumi_azure import appinsights, appservice, core, keyvault, storage

from apps.consumption_plan import get_consumption_plan
from utils.config import get_config
from utils.sas import signed_blob_read_url


def create_images_app(
    resource_group: core.ResourceGroup,
    insights: appinsights.Insights,
    key_vault: keyvault.KeyVault,
    image_storage_connection: str,
    origins=[],
) -> appservice.FunctionApp:
    config = get_config()

    app_source_dir = Path(__file__).parent.joinpath("../../apps/images/.dist").resolve()

    plan, storage_account = get_consumption_plan(
        resource_group_name=resource_group.name
    )

    container = storage.Container(
        "nvd-images-app-deployments",
        storage_account_name=storage_account.name,
        container_access_type="private",
        opts=ResourceOptions(aliases=[Alias(name="images-app-container")]),
    )

    zip_blob = storage.Blob(
        "nvd-images-zip-blob",
        storage_account_name=storage_account.name,
        storage_container_name=container.name,
        type="Block",
        source=asset.FileArchive(str(app_source_dir)),
    )

    secret = keyvault.Secret(
        "nvd-images-depl",
        key_vault_id=key_vault.id,
        value=signed_blob_read_url(zip_blob, storage_account),
    )

    secret_uri = Output.concat(
        key_vault.vault_uri, "secrets/", secret.name, "/", secret.version
    )

    allowed_origins = origins + [
        "https://functions-staging.azure.com",
        "https://functions.azure.com",
        "https://functions-next.azure.com",
    ]

    function_app = appservice.FunctionApp(
        "nvd-images-function-app",
        resource_group_name=resource_group.name,
        app_service_plan_id=plan.id,
        storage_account_name=storage_account.name,
        storage_account_access_key=storage_account.primary_access_key,
        version="~3",
        identity=appservice.FunctionAppIdentityArgs(type="SystemAssigned"),
        site_config=appservice.FunctionAppSiteConfigArgs(
            cors=appservice.FunctionAppSiteConfigCorsArgs(
                allowed_origins=allowed_origins
            ),
            ftps_state="Disabled",
        ),
        app_settings={
            "APPINSIGHTS_INSTRUMENTATIONKEY": insights.instrumentation_key,
            "FUNCTIONS_WORKER_RUNTIME": "node",
            "AZURE_STORAGE_CONNECTION_STRING": image_storage_connection,
            "IMAGES_CONTAINER": "$web",
            "WEBSITE_RUN_FROM_PACKAGE": Output.concat(
                "@Microsoft.KeyVault(SecretUri=", secret_uri, ")"
            ),
            "WEBSITE_NODE_DEFAULT_VERSION": "~12",
        },
        https_only=True,
        os_type="linux",
    )

    images_app_policy = keyvault.AccessPolicy(
        "nvd-images-app-policy",
        key_vault_id=key_vault.id,
        tenant_id=function_app.identity.apply(
            lambda id: id.tenant_id or "11111111-1111-1111-1111-111111111111"
        ),
        object_id=function_app.identity.apply(
            lambda id: id.principal_id or "11111111-1111-1111-1111-111111111111"
        ),
        secret_permissions=["get"],
    )

    return function_app
