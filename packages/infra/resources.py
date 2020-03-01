import subprocess
import json

from pulumi import dynamic
from urllib.parse import urlparse

account_name_prop = "account_name"


class StorageStaticWebsiteProvider(dynamic.ResourceProvider):
    def check(self, _olds, news):
        failures = []

        if not account_name_prop in news:
            failures.append(
                {
                    "property": account_name_prop,
                    "reason": "required property {} missing".format(account_name_prop),
                }
            )

        return dynamic.CheckResult(news, failures)

    def diff(self, _id, olds, news):
        replaces = []

        if olds[account_name_prop] != news[account_name_prop]:
            replaces.push(account_name_prop)

        return dynamic.DiffResult(replaces=replaces)

    def create(self, props):
        account_name = props[account_name_prop]

        subprocess.run(["az", "extension", "add", "--name", "storage-preview"])

        result = subprocess.run(
            [
                "az",
                "storage",
                "blob",
                "service-properties",
                "update",
                "--account-name",
                account_name,
                "--static-website",
                "--404-document",
                "404.html",
                "--index-document",
                "index.html",
            ],
            stdout=subprocess.PIPE,
        )
        update = json.loads(result.stdout)

        if update["staticWebsite"]["enabled"] is not True:
            raise Exception("Static website update failed")

        result = subprocess.run(
            [
                "az",
                "storage",
                "account",
                "show",
                "-n",
                account_name,
                "--query",
                "primaryEndpoints.web",
            ],
            stdout=subprocess.PIPE,
        )
        endpoint = json.loads(result.stdout)
        parsed_uri = urlparse(endpoint)

        web_container_name = "$web"

        return dynamic.CreateResult(
            "{}StaticWebsite".format(account_name),
            outs={
                account_name_prop: account_name,
                "endpoint": endpoint,
                "hostname": parsed_uri.netloc,
                "webContainerName": web_container_name,
            },
        )


class StorageStaticWebsite(dynamic.Resource):
    def __init__(self, name, account_name, opts=None):
        super().__init__(
            StorageStaticWebsiteProvider(),
            name,
            {
                account_name_prop: account_name,
                "endpoint": None,
                "hostname": None,
                "webContainerName": None,
            },
            opts=opts,
        )
