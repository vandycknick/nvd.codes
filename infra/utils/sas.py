from pulumi import Output
from pulumi_azure import storage


def get_sas(args) -> str:
    blob_sas = storage.get_account_blob_container_sas(
        connection_string=args[1],
        start="2020-01-01",
        expiry="2030-01-01",
        container_name=args[2],
        permissions={
            "read": "true",
            "write": "false",
            "delete": "false",
            "list": "false",
            "add": "false",
            "create": "false",
        },
    )
    return f"https://{args[0]}.blob.core.windows.net/{args[2]}/{args[3]}{blob_sas.sas}"


def signed_blob_read_url(blob: storage.Blob, account: storage.Account):
    return Output.all(
        account.name,
        account.primary_connection_string,
        blob.storage_container_name,
        blob.name,
    ).apply(get_sas)