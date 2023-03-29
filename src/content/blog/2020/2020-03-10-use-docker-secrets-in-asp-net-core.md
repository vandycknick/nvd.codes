---
title: Docker secrets in ASP.NET Core
description: In this post, I want to show you a simple and different way to share secrets to your application. What are docker secrets and how can I start using them in my ASP.NET Core application? Keep reading 😄.
date: 2020-03-10T20:00:00+01:00
categories: [dotnet, aspnet, docker, secrets]
cover: ~/assets/2020-03-10-use-docker-secrets-in-asp-net-core/cover.jpg
---

## What are docker secrets?

In its most simple form, they are just a way to share secrets securely and only with a docker container that needs access to them. They were first introduced in Docker Swarm version 1.13, secrets are encrypted during transit and at rest. This makes them a great way to distribute connection strings, passwords, certs or other sensitive information. Now you might be wondering, can I than only use them with Docker Swarm? And that is were `docker-compose` comes into the story, with `docker-compose` we can leverage this feature for development without ever needing Docker Swarm.

## How to use Docker secrets with docker-compose

For example, imagine the following project. We have a `docker-compose.yml` file and right next to it we have a file that contains our secret.

```bash
├── docker-compose.yml
└── my-little-secret.txt
```
To use this in our `docker-compose.yml` file there are 2 things we need to do:

1. Define a new top-level secret under the secrets key, give it a name and a reference to our file. In the example, you will see that the `file` key contains a reference `my-little-secret.txt`
2. Next up you can add a reference to that secret for any containers that need access to it.

```yaml
version: "3.6"

services:

  web:
    image: ubuntu
    entrypoint: "cat /run/secrets/super_secret"
    secrets: # (2)
      - super_secret

secrets: # (1)
  super_secret:
    file: ./my-little-secret.txt
```

This secret file can contain whatever you prefer, and it is up to your application to interpret in whatever way it seems fit. If you like to use JSON or YAML to store multiple secrets in one file then this is possible. What I prefer to do is to limit this to one secret per file, this way you simulate a key-value store based on your file system. This makes it easier to scope certain secrets to specific containers and makes sure that you abide by the rules of least privilege. It will also make it easier to consume your secrets in ASP.NET easier as you will see later.

For example, imagine our `my-little-secret.txt` file contained the following secret:

```
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

This package uses files inside a given directory as configuration key/values.

```csharp
.ConfigureAppConfiguration((hostingContext, config) =>
{
    config.AddKeyPerFile(directoryPath: "/run/secrets", optional: true);
})
```

## Conclusion
Docker Secrets can be used without Docker Swarm and can be pretty useful for development purposes. Just adding some extra configuration into your `docker-compose.yml` it is possible to give containers access to specific secrets. That in combination with ASP.NET `KeyPerFile` nuget package makes it easy to get those secrets injected into your application.

You might be wondering when or why you would use this instead of using `.env`, `.envrc` files or any other ASP.NET configuration method. I use this for my project where for example I have a single location on my PC to share common secrets among my projects. This way I know that I just need to look into a single location to update or rotate any secret.
