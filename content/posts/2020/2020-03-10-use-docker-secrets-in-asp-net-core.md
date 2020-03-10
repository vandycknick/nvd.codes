---
title: Docker secrets in ASP.NET Core
description: A quick introduction to docker secrets, how to use them with docker-compose and how to get access to them in ASP.NET Core.
date: 2020-03-10 20:00:00 +01:00
categories: [dotnet, aspnet, docker, secrets]
---

Docker Secrets are a way to share secrets securely and only with the container that needs access to them. First introduced in Docker Swarm version 1.13, secrets are encrypted during transit and at rest. This makes them a great way to distribute connection strings, passwords, certs or other sensitive information.

I don't use Docker Swarm nor am I planning to use it anytime soon. And that is were `docker-compose` comes into the story, with `docker-compose` we can leverage this feature for development without tacking a dependency on Docker Swarm.

## How to use Docker secrets with docker-compose

For example, imagine the following project. We have a `docker-compose.yml` file and our secret right next to it.

```bash
├── docker-compose.yml
└── my-little-secret.txt
```

We define a new secret called `super_secret` that references our secret file `my-little-secret.txt`. We can then give specific containers access to that secret.

```yml
version: "3.6"

services:

  web:
    image: ubuntu
    entrypoint: "cat /run/secrets/super_secret"
    secrets:
      - super_secret

secrets:
  super_secret:
    file: ./my-little-secret.txt
```

The secret file can contain whatever you want, I prefer to keep it 1 to 1, where each file contains the value of a secret. This makes it easier to scope certain secrets to specific containers

For example, imagine our `my-little-secret.txt` file contained the following secret:

```txt
please-do-not-tell
```

Running `docker-compose up --build` should output the following:

```sh
$ docker-compose up --build
...
please-do-not-tell
```

## Configure ASP.NET Core to read Docker secrets

When you give a service/container access to a certain secret you essentially give it access to an in-memory file. As you could see in the example above those files are exposed inside the container straight from the filesystem `/run/secrets`. This means your application needs to know how to read the secret from the file to be able to use the application.

There are quite a few ways we can solve this problem, it should not be too difficult to hand roll our solution here. With an ASP.NET Core Configuration Provider and a bit of elbow grease, we could get something up and running. But the ASP.NET Core team already got you covered here in the form of a Configuration extension package. `Microsoft.Extension.Configuration.KeyPerFile` nuget package contains exactly the functionality we need in this case.

A simple nuget install in your project or adding the following in your `csproj` should yet you up and running in no time.

```xml
...
<PackageReference Include="Microsoft.Extensions.Configuration.KeyPerFile" Version="3.1.2" />
...
```

This package uses a directory's files as configuration key/values:

```csharp
.ConfigureAppConfiguration((hostingContext, config) =>
{
    config.AddKeyPerFile(directoryPath: "/run/secrets", optional: true);
})
```

## Conclusion
Docker Secrets can be used without Docker Swarm and can be pretty useful for development purposes. Just adding some extra configuration into your `docker-compose.yml` it is possible to give containers access to specific secrets. That in combination with ASP.NET `KeyPerFile` nuget package makes it easy to get those secrets injected into your application.

You might be wondering when or why you would use this instead of using `.env`, `.envrc` files or any other ASP.NET configuration method. I use this for my project where for example I have a single location on my PC to share common secrets among my projects. This way I know that I just need to look into a single location to update or rotate any secret.
