from pathlib import Path
from pulumi import FileAsset
from pulumi_cloudflare import WorkerScript, WorkerRoute

from utils.config import get_config


def create_security_headers_app():
    config = get_config()
    worker_file_path = (
        Path(__file__).parent.joinpath("../../apps/headers/.dist/worker.js").resolve()
    )
    with open(worker_file_path, "r") as worker_file:
        worker_content = worker_file.read()

    script = WorkerScript(
        "custom-headers", name="nvd-codes-headers", content=worker_content,
    )

    exclude_assets = WorkerRoute(
        "next-js-assets",
        pattern="nvd.codes/_next/*",
        zone_id=config.require("zone_id"),
    )

    route = WorkerRoute(
        "custom-headers-route",
        pattern="nvd.codes/*",
        zone_id=config.require("zone_id"),
        script_name=script.name,
    )

