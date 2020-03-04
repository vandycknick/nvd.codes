import os

from pathlib import Path
from pulumi import asset, export, Output, Config
from pulumi_azure import core, storage, appservice

from infra.utils import get_sas

current_file_path = os.path.dirname(os.path.realpath(__file__))


class ProjectApi:
    def __init__(self, app: appservice.FunctionApp):
        self.app = app


def create_project_api(
    resource_group: core.ResourceGroup, plan: appservice.Plan, config: Config
):
    project_api_storage_account = storage.Account(
        "projectapisa",
        resource_group_name=resource_group.name,
        account_kind="StorageV2",
        account_tier="Standard",
        account_replication_type="LRS",
    )

    project_api_container = storage.Container(
        "project-api-container",
        storage_account_name=project_api_storage_account.name,
        container_access_type="private",
    )

    projects_api_folder = Path(
        current_file_path,
        "../../../projects-api/.build/bin/ProjectsApi/Release/netcoreapp3.1/publish",
    ).resolve()
    zip_blob = storage.ZipBlob(
        "project-api-zipblob",
        storage_account_name=project_api_storage_account.name,
        storage_container_name=project_api_container.name,
        type="block",
        content=asset.AssetArchive({".": asset.FileArchive(str(projects_api_folder))}),
    )

    signed_blob_url = Output.all(
        project_api_storage_account.name,
        project_api_storage_account.primary_connection_string,
        project_api_container.name,
        zip_blob.name,
    ).apply(get_sas)

    project_api_function_app = appservice.FunctionApp(
        "project-api-app",
        resource_group_name=resource_group.name,
        app_service_plan_id=plan.id,
        storage_connection_string=project_api_storage_account.primary_connection_string,
        version="~3",
        app_settings={
            "FUNCTIONS_WORKER_RUNTIME": "dotnet",
            "GITHUB_TOKEN": config.require("github_token"),
            "WEBSITE_RUN_FROM_PACKAGE": signed_blob_url,
        },
    )

    return ProjectApi(project_api_function_app)
