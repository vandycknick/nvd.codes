---
title: "Where's dig"
description: Nowadays, it is relatively common to find a stripped-down docker container. While great to save precious bytes on hard drives, this might complicate things when you quickly need to debug something. This post explains how you can quickly install dig or nslookup within your container on different distros.
slug: wheres-dig
date: 2022-07-15T20:00:00+01:00
categories:
  - linux
  - dig
cover: ./images/cover.jpg
---

As a DevOps engineer, I often get asked to help troubleshoot particular issues within our containerized environments. When these issues are networking-related, one of the first things I like to check is DNS. For this tools like dig or nslookup are exactly built to provide me with what I'm looking for. But with modern containers being stripped down, it often means these tools aren't installed by default anymore. This further complicates the debugging process. Making matters worse is that dig or nslookup aren't installed by the same package. Hence I often forget to which package this belongs to in different distros, causing me to dive into google until I find the right package name. Well, in this post, I want to fix this once and for all and give an overview on how to install dig in all linux distros I run into:

## Installing on Ubuntu or Debian

On Debian flavoured distro's dig and nslookup are packaged up in `dnsutils`:

```sh
apt update && apt install dnsutils
```

## Installing on Alpine

In alpine dig and nslookup are packaged up in `bind-tools`

```sh
apk update && apk add bind-tools
```

## Installing on CentOS or any RHEL flavoured distro

To mix things up again the folks managing RHEL decided to package dig and nslookup in `bind-utils`

```sh
dnf update && dnf install bind-utils
```

or on Amazon Linux

```sh
yum update && yum install bind-utils
```

## Installing on ArchLinux

On Arch dig and nslookup are in `bind-tools`:

```sh
pacman -Syu && pacman -Sy bind-tools
```

## Installing on OpenSUSE

OpenSUSE uses a package manager called zypper and just like arch you find `dig` and `nslookup` in `bind-utils`

```sh
zypper update && zypper install bind-utils
```

## Conclusion

It's a bit sad that the package containing dig or nslookup differs per distro or package manager. I guess it didn't really matter back in the "old" days, when people would just stick with a single distro. But now, with containerization being the norm as a DevOps or Site reliability engineer, it's far more common to bump into many different Linux flavours. Not having the same package just adds unnecessary friction. Nonetheless I hope this post gives a good overview of how you can get past this quickly and get back to the task at hand without
