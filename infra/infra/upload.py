import os
import sys
import stat
import argparse
import mimetypes

from pathlib import Path
from azure.storage.blob import BlobServiceClient, ContentSettings

ONE_MINUTE = 60
ONE_HOUR = 60 * ONE_MINUTE
ONE_DAY = 24 * ONE_HOUR

NO_CACHE = "no-cache"
ONE_MIN_CACHE = "public, max-age={}".format(ONE_MINUTE)
ONE_DAY_CACHE = "public, max-age={}".format(ONE_DAY)
MAX_AGE_CACHE = "public, max-age=31536000"


def is_input_redirected() -> bool:
    if os.isatty(sys.stdin.fileno()):
        return False
    else:
        mode = os.fstat(0).st_mode
        if stat.S_ISFIFO(mode):
            return True
        elif stat.S_ISREG(mode):
            return True
        else:
            return False


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        prog="az-uploader",
        description="Upload static files to an azure blob storage account.",
    )

    parser.add_argument("--cwd", action="store", type=str)
    parser.add_argument("--container", action="store", type=str, required=True)
    parser.add_argument("--connection-string", action="store", type=str)

    args = parser.parse_args(sys.argv[1:])

    if is_input_redirected():
        connection_string = next(sys.stdin).strip()
    else:
        connection_string = args.connection_string.strip()

    cwd = Path(args.cwd or os.getcwd())
    container = args.container

    if not connection_string:
        raise Exception("connection string is required!")

    if cwd.is_dir() is False:
        raise Exception("cwd should point to an existing directory!")

    files = [file for file in cwd.rglob("*") if file.is_file()]

    blob_service_client = BlobServiceClient.from_connection_string(connection_string)
    blob_container = blob_service_client.get_container_client(container)

    for file in files:
        relative = os.path.relpath(file, cwd)

        print("Uploading file: {0}".format(file))

        (content_type, content_encoding) = mimetypes.guess_type(file)
        content_settings = ContentSettings(
            content_type=content_type or "application/octet-stream"
        )

        if content_type == "application/javascript" or content_type == "text/css":
            content_settings.cache_control = MAX_AGE_CACHE
        elif content_type == "text/html" or content_type == "application/json":
            content_settings.cache_control = ONE_MIN_CACHE
        elif content_type == "image/jpeg":
            content_settings.cache_control = ONE_DAY_CACHE
        else:
            content_settings.cache_control = NO_CACHE

        blob_container.upload_blob(
            relative,
            file.read_bytes(),
            overwrite=True,
            content_settings=content_settings,
        )
