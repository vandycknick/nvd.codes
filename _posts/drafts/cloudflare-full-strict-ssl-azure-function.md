---
id: 0cbad1a1-ae5a-47d2-884e-5a541f0d865d
title: Cloudflare full strict ssl azure function
draft: true
---

Create a origin certificate on cloudflare:

download pem certificate and key:

cloudflare.key

and 

cloudflare.pem

convert to pfx file for azure

```sh
openssl pkcs12 -inkey mykey.key -in mycert.pem -export -out mycert.pfx
```


### Azure CDN ssl cert key vault

-> https://docs.microsoft.com/en-us/azure/cdn/cdn-custom-ssl?tabs=option-2-enable-https-with-your-own-certificate

```sh
az ad sp create --id "205478c0-bd83-4e1b-a9d6-db63a3e1e1c8"
```
