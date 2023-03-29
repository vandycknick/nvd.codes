---
title: Set up Docker from scratch on WSL 2
description: In this post, I talk about some of the changes in WSL2 and how it allows you to run a wider range of applications. Then I walk through the process of setting up docker from scratch and how this compares to using Docker for Windows
date: 2020-05-31T22:00:00+01:00
slug: set-up-docker-from-scratch-on-wsl2
categories: [wsl2, docker, linux]
cover: ~/assets/2020-05-31-set-up-docker-from-scratch-on-wsl2/cover.jpg
---

Just recently Microsoft released its latest update to Windows and with it comes an update to WSL. Previously it was using a translation layer that translated Linux system calls into NT system calls. This allowed running unmodified native ELF binaries directly under Windows albeit with some restrictions. It's exactly those restrictions that made it impossible to run Docker natively on the subsystem. The reason for this is that for a good chunk of the API's to make namespaces, cgroups, ... work the implementation just wasn't there and seemed non-trivial to implement. This all changed as of WSL2 as Windows now ships with a full-fledged Linux kernel, using virtualization technologies to improve file system performance and adding full system call compatibility.

To get Docker running natively under this recent version, you can just install the latest Docker for Windows. The installer will guide you through the process and offer the option to use docker under WSL 2. The process is straightforward and from my experience, it makes using docker under Windows even more reliable and giving it that native feeling. The way it works is that the installer will create a new WSL instance under which it installs the whole docker toolchain. You can have a peek at this by running `wsl -l -v` which should print something similar like the following:

```bash
NAME                   STATE           VERSION
* Ubuntu-20.04           Stopped         2
  docker-desktop-data    Running         2
  docker-desktop         Running         2
```

It's those `docker-desktop*` instances that will host docker and any containers or images. There is a flag buried in the `Docker for Windows` settings menu that allows you to expose this same docker environment to your other WSL instances. `Settings>Resources>WSL Integration` has a toggle for each WSL instance. The way this works is that it will add a few binaries to that WSL instance and a proxy that forwards any requests.

```bash
$ ps aux

root         1  0.2  0.0    892   576 ?        Sl   10:35   0:00 /init
root         6  0.0  0.0    892    80 ?        Ss   10:35   0:00 /init
root         7  0.0  0.0    892    80 ?        R    10:35   0:00 /init
username     8  1.0  0.0  10040  5072 pts/0    Ss   10:35   0:00 -bash
root        45  0.0  0.0    892    80 ?        Ss   10:35   0:00 /init
root        46  0.0  0.0    892    80 ?        S    10:35   0:00 /init
root        47  1.0  0.1 563128 20060 pts/1    Ssl+ 10:35   0:00 /mnt/wsl/docker-desktop/docker-desktop-proxy --distro-name Ubuntu-20.04 --docker-desktop-ro
username    54  0.0  0.0  10604  3296 pts/0    R+   10:35   0:00 ps aux
```

But what if you want to run and manage your own setup without using `Docker on Windows`. Well, that's possible too! Remember we are running on a full Linux kernel now. So, for whatever distro you are using now, you can follow the standard docker installation instructions for that distribution. I'm using Ubuntu so let me walk you through the process of setting this up. If you are running another distro have a look at the docker documentation here: [https://docs.docker.com/engine/install/](https://docs.docker.com/engine/install/)

## Installation

First let's update our packages and install some dependencies that are required in order to get docker up and running.

```bash
sudo apt update
sudo apt install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common
```

Next, we will need to grab the official docker PGP key.

```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```

Have a look at the official docker installation docs to help you in verifying that the key you just installed is the correct one. It just boils down to this:

```bash
sudo apt-key fingerprint 0EBFCD88

pub   rsa4096 2017-02-22 [SCEA]
      9DC8 5822 9FC7 DD38 854A  E2D8 8D81 803C 0EBF CD88
uid           [ unknown] Docker Release (CE deb) <docker@docker.com>
sub   rsa4096 2017-02-22 [S]
```

Run the following command to get the docker repository set up:

```bash
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
```

Ok, that's all the setup and preparation work we needed to get done. Now let's get our hands dirty and install docker. If you prefer to install a specific version, then have a look at the official docs again. Those will explain what you need to change to the following command to install that specific version.

```bash
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
```

> During the installation process it will ask to configure and setup grub. You can safely skip this procedure because the WSL Linux kernel doesn't use grub.

At this point, we should have docker installed and available to use, we can verify this by running the following commands:

```bash
$ which docker

/usr/bin/docker

$ docker images

Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?
```

We can see that we have docker installed, but when running it we get an error message saying that we can't connect to the Docker daemon. WSL doesn't use systemd so docker won't be able to start on its own. We will need to start the daemon manually by using the following command:

```bash
sudo service docker start
```

After this, the last thing you need to do is to add your current user to the docker group. This will allow you to use the Docker cli without typing `sudo`

```bash
sudo usermod -aG docker $USER
```

For this to take into effect we will need to restart our instance `wsl --terminate name-of-wsl-distro` or `wsl --shutdown` (caution this last one will shut down all your WSL instances).

You will notice that when you restart your WSL instance the docker daemon is not automatically started again. At the moment there isn't a recommended way to start the daemon on boot. The current recommendation [https://github.com/microsoft/WSL2-Linux-Kernel/issues/30#issuecomment-558241868](https://github.com/microsoft/WSL2-Linux-Kernel/issues/30#issuecomment-558241868) is to launch the daemon in your `.bashrc`

We will need to edit the `sudoers` file with `sudo visudo` and add the following line at the bottom of the file, replacing `username` with the name of your current user.

```bash
username ALL=NOPASSWD:/usr/sbin/service docker start
```

Then in your `.bashrc` file you can add to the following to start the service when it's not running yet.

```bash
service docker status > /dev/null || sudo service docker start
```

## Putting it all together

You should be all set up now, let's try a few commands to check whether our setup is working. The default docker installation guides you into running the `hello-world` image, so let's give that a try:

```bash
$ docker run hello-world

Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
0e03bdcc26d7: Pull complete
Digest: sha256:6a65f928fb91fcfbc963f7aa6d57c8eeb426ad9a20c7ee045538ef34847f44f1
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/
```

If you get a similar result as the one above, then that means everything is working. But let's take it one step further and see if we can build an image and get a webserver up and running. Paste the following into a `Dockerfile`

```docker
FROM mcr.microsoft.com/dotnet/core/sdk:3.1

RUN dotnet new web -o /app/HelloWorld

WORKDIR /app/HelloWorld

CMD ["dotnet", "run", "--urls", "http://0.0.0.0:5000"]
```

Then in the same directory as where you created this `Dockerfile` plug the following commands in your terminal `docker build -t hello-world-aspnet .` and `docker run -it -p 5000:5000 hello-world-aspnet` .  You should now have an ASPNET Core web app running on port 5000:

```bash
$ curl -i http://localhost:5000

HTTP/1.1 200 OK
Date: Sun, 31 May 2020 07:02:08 GMT
Server: Kestrel
Transfer-Encoding: chunked

Hello World!
```

Congratulations you now have Docker running natively under WSL 2 on a Linux kernel that's shipped with Windows 🤯.

## Summary

In this post, I talked about what changed in WSL 2 to make docker run on this subsystem. To then go through the Docker for Windows setup process briefly, how you can get it running on WSL and how this works internally. I also showed you how to get docker up and running from scratch onto a new WSL instance. How to overcome any issues you might face when installing it from scratch and having it automatically start up when your WSL instance boots. This process can be scripted to save you time on your next setup and with help of `wsl --export` you can easily create an export that can be used as a backup.
