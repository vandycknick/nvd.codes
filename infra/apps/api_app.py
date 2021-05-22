from pathlib import Path
from pulumi import asset, Output, Config
from pulumi_azure import core, appservice, storage, appinsights, keyvault

from apps.consumption_plan import get_consumption_plan
from utils.config import get_config
from utils.sas import signed_blob_read_url


def create_api_app(
    resource_group: core.ResourceGroup,
    insights: appinsights.Insights,
    key_vault: keyvault.KeyVault,
    origins=[],
) -> appservice.FunctionApp:
    config = get_config()

    app_source_dir = Path(__file__).parent.joinpath("../../apps/api/.dist").resolve()

    plan, storage_account = get_consumption_plan(
        resource_group_name=resource_group.name
    )

    api_container = storage.Container(
        "nvd-api-app-deployments",
        storage_account_name=storage_account.name,
        container_access_type="private",
    )

    zip_blob = storage.Blob(
        "nvd-api-zip-blob",
        storage_account_name=storage_account.name,
        storage_container_name=api_container.name,
        type="Block",
        source=asset.FileArchive(str(app_source_dir)),
    )

    secret = keyvault.Secret(
        "nvd-api-depl",
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
        "nvd-api-function-app",
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
            "GITHUB_TOKEN": config.require_secret("github_token"),
            "ISSUE_QUERY": "user:nickvdyck repo:nvd.codes author:nickvdyck label:comment",
            "WEBSITE_RUN_FROM_PACKAGE": Output.concat(
                "@Microsoft.KeyVault(SecretUri=", secret_uri, ")"
            ),
            "WEBSITE_NODE_DEFAULT_VERSION": "~12",
        },
        https_only=True,
        os_type="linux",
    )

    api_app_policy = keyvault.AccessPolicy(
        "nvd-api-app-policy",
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
