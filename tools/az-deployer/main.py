import zipfile
import io
import os
import pathlib
import uuid

from datetime import datetime, timedelta
from typing import Union
from zipfile import ZipFile, ZIP_DEFLATED
from azure.storage.blob import BlobServiceClient, BlobClient, BlobType, BlobSasPermissions, UserDelegationKey, generate_blob_sas


class InMemoryZip(object):
    def __init__(self):
        self.in_memory_zip = io.BytesIO()

    def append(self, filename_in_zip: str, file_contents: Union[bytes, str]):
        zipfile = ZipFile(self.in_memory_zip, "a", ZIP_DEFLATED, False)

        zipfile.writestr(filename_in_zip, file_contents)

        for file in zipfile.filelist:
            file.create_system = 0

        return self

    def read(self):
        self.in_memory_zip.seek(0)
        return self.in_memory_zip.read()

    def write_file(self, filename):
        file = open(filename, "wb")
        file.write(self.read())
        file.close()


def create_zip_from_folder(path: str) -> InMemoryZip:
    zip_file = InMemoryZip()

    for root, dirs, files in os.walk(path):
        root_path = pathlib.Path(root).relative_to(path)

        for file in files:
            relative = pathlib.Path(root_path, file)
            filepath = pathlib.Path(root, file)
            zip_file.append(str(relative), filepath.read_bytes())

    return zip_file

def generate_blob_sas_url(blob_client: BlobClient) -> str:
    sas = generate_blob_sas(
        blob_client.account_name,
        blob_client.container_name,
        blob_client.blob_name,
        account_key=blob_client.credential.account_key,
        permission=BlobSasPermissions(read=True),
        expiry=datetime.now() + timedelta(days = (10 * 365)),
    )

    url = f"https://{blob_client.account_name}.blob.core.windows.net/{blob_client.container_name}/{blob_client.blob_name}?{sas}"
    return url

if __name__ == "__main__":
    target_path = "../../.build/bin/ProjectsApi/Release/netcoreapp3.1/publish"

    connection_string = os.getenv('AZURE_STORAGE_CONNECTION_STRING')
    container_name = os.getenv('AZURE_CONTAINER_NAME')

    blob_service_client = BlobServiceClient.from_connection_string(connection_string)

    suffix = uuid.uuid4()
    blob_client = blob_service_client.get_blob_client(container=container_name, blob=f"project-api-{suffix}.zip")

    artefact = create_zip_from_folder(target_path)
    data = artefact.read()
    blob_client.upload_blob(data, blob_type=BlobType.BlockBlob)

    url = generate_blob_sas_url(blob_client)
    print(url)
