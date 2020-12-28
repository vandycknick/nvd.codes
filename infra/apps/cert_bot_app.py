from pathlib import Path
from pulumi import asset, Output
from pulumi_azure import appservice, appinsights, core, keyvault, storage

from apps.consumption_plan import get_consumption_plan
from utils.config import get_config
from utils.sas import signed_blob_read_url


def create_cert_bot_app(
    resource_group: core.ResourceGroup,
    insights: appinsights.Insights,
    key_vault: keyvault.KeyVault,
    origins=[],
) -> appservice.FunctionApp:
    config = get_config()
    app_source_dir = (
        Path(__file__).parent.joinpath("../../apps/cert-bot/.dist").resolve()
    )

    plan, storage_account = get_consumption_plan(
        resource_group_name=resource_group.name
    )

    container = storage.Container(
        "nvd-cert-bot-app-deployments",
        storage_account_name=storage_account.name,
        container_access_type="private",
    )

    zip_blob = storage.Blob(
        "nvd-cert-bot-zip-blob",
        storage_account_name=storage_account.name,
        storage_container_name=container.name,
        type="Block",
        source=asset.FileArchive(str(app_source_dir)),
    )

    secret = keyvault.Secret(
        "nvd-cert-bot-depl",
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
        "nvd-cert-bot-function-app",
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
            "AZURE_KEYVAULT_NAME": key_vault.name,
            "AZURE_KEYVAULT_CERTIFICATE_NAME": "nvd-codes-root-cert",
            "AZURE_KEYVAULT_SECRET_NAME": "nvd-codes-acme-account",
            "AZURE_SUBSCRIPTION_ID": core.get_subscription().id.split("/")[-1],
            "AZURE_RESOURCE_GROUP": resource_group.name,
            "ACME_TOP_LEVEL_DOMAIN_NAME": "nvd.codes",
            "ACME_CONTACT_URL": Output.concat(
                "@Microsoft.KeyVault(SecretUri=",
                key_vault.vault_uri,
                "secrets/acme-contact-url/26f4e8a510f643b5bb46ab378104b5c0)",
            ),
            "ACME_DIRECTORY_URL": "https://acme-v02.api.letsencrypt.org/directory",
            "CLOUDFLARE_ZONE_ID": Output.concat(
                "@Microsoft.KeyVault(SecretUri=",
                key_vault.vault_uri,
                "secrets/cloudflare-nvd-codes-zone-id/02d6f441be3a4ff4b3d40f2b49c03237)",
            ),
            "CLOUDFLARE_API_TOKEN": Output.concat(
                "@Microsoft.KeyVault(SecretUri=",
                key_vault.vault_uri,
                "secrets/cloudflare-nvd-codes-api-token/82bc1fccf5d04b529f28dcce8c84ca00)",
            ),
            "WEBSITE_RUN_FROM_PACKAGE": Output.concat(
                "@Microsoft.KeyVault(SecretUri=", secret_uri, ")"
            ),
            "WEBSITE_NODE_DEFAULT_VERSION": "~12",
        },
        https_only=True,
        os_type="linux",
    )

    cert_bot_app_policy = keyvault.AccessPolicy(
        "nvd-cert-bot-app-policy",
        key_vault_id=key_vault.id,
        tenant_id=function_app.identity.apply(
            lambda id: id.tenant_id or "11111111-1111-1111-1111-111111111111"
        ),
        object_id=function_app.identity.apply(
            lambda id: id.principal_id or "11111111-1111-1111-1111-111111111111"
        ),
        secret_permissions=["get", "list", "set"],
        certificate_permissions=["get", "list", "import"],
    )

    return function_app
