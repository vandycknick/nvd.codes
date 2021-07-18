#! /usr/bin/env sh

mkdir -p /opt/oracle
cd /opt/oracle || exit 1


if [ "$(uname -m)" = "aarch64" ]; then
    curl -L https://download.oracle.com/otn_software/linux/instantclient/191000/instantclient-basic-linux.arm64-19.10.0.0.0dbru.zip -o instantclient-basic.zip
else
    curl -L https://download.oracle.com/otn_software/linux/instantclient/1911000/instantclient-basic-linux.x64-19.11.0.0.0dbru.zip -o instantclient-basic.zip
fi

unzip instantclient-basic.zip
