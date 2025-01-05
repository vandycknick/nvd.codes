---
title: "Securing Linux containers with capabilities"
description: .
date: 2021-02-05T20:00:00+01:00
categories: [docker, linux, capabilities, containers]
draft: true
cover: ../images/placeholder.png
---

Security is something that is often taken for granted when working with docker containers. We are used to spinning up containers and expect them to be secure by default. But is this actually the case and what do container runtimes like docker actually use to lock down the sandbox our app is running on? As you can already derive from the title, one thing it uses is a feature inside the Linux kernel named capabilities. Linux capabilities and how they interact with users and containers can often even confuse the most experienced engineers. At first glance, it might seem straightforward, but things can get more complex rather quick and information often seems spread around on the internet in git repos or blog posts. Which sometimes makes it hard to start piecing these things together. They play an important role in container security, so let's dive and have a look at why this is the case!

## What are Capabilities

Traditional UNIX privilege mode dives users into 2 groups:

- _Normal Users_ subject to privilege checking based on UID (user ID) and GIDs (group IDs)
- _Super User_ (uid 0) which bypasses many of those checks.

Traditional mechanism for giving privilege to an unprivileged user is don via set-UID root program

```
chown root prog
chmod u+s prog
```

- When executed, process assumes UID of file owner
  - process gains privilege of superuser
- Powerful but dangerous

Root is often thought of being this all-powerful user, but that's actually not the whole picture, only the `root` user with all capabilities is all-powerful. In essence, capabilities turn the binary `root/non-root` into a fine-grained access control system. Or according to the capabilities man page (`man capabilities`), capabilities are distinct units of privilege that can be independently enabled or disabled. They were first added to the Linux [kernel](https://mirrors.edge.kernel.org/pub/linux/libs/security/linux-privs/kernel-2.2/capfaq-0.2.txt) about 15 years ago, with the aim of to divide up the powers of the root user. Back then `root` actually was this all-powerful user and processes would only run in privileged or non-privileged mode. Either your process could do everything and make admin-level kernel calls or it was restricted to the constraints of a standard user. Certain programs need to be run by standard users but also make privileged kernel calls would require to set the suid bit. This effectively grants this binary full privileged access and it's binaries like these that are a prime target for hackers to exploit and gain privileged access to a machine.

This isn't a great situation to be in and is exactly why kernel developers came up with a more nuanced solution by splitting up these privileges into several separate capabilities. Each capability is defined as a bitmask which allows us to compose them together. Originally the kernel allocated a 32-bit bitmask to define these capabilities. But a few years this was expanded into 64 bits and we are currently sitting at around 40 defined capabilities.

Capabilities are things like the ability to send raw IP packets or bind to ports below 1024. When we run containers we can drop a whole bunch of capabilities before running our containers without causing the vast majority of containerized applications to fail. This often confuses a lot of people but normal processes often need zero capabilities in order to run. Yes, you read that right any LOB app you write, written in python, java, golang, c#, ... should run perfectly without with all capabilities removed. The reason for this is that lots of things in the Linux kernel being it accessing memory, disk, devices is behind a file like api, which are primarily controlled by traditional file privileges. For example if you want to read information about running processes, you have the `/proc` pseudo-file system, all of which is nicely guarded by file privileges. This means that capabilities are generally only needed to add gatekeeping around any system-level tasks.

But as with most things in this world we often need to establish a compromise between security and the ability to get the work done. That's why there are valid cases where you would like to enable some capabilities for some containers. That's why in my opinion dropping all capabilities by default is a good idea, if needs be we can granularly enable some of these again for some more specialized workloads. This tries to strike a good balance between being secure by default but still giving the flexibility to grant access to more specialized features where needed.

## Granting and inheriting capabilities

Let's dive a bit deper and find out what capabilites are set for a given process. To find that out, let's spin up a docker container and have a look at what capabilities it has enabled for us by default.

```sh
docker run -it -h default ubuntu bash
```

> The `-it` flag will make sure the container is interactive and has a tty allocated so it acts and behaves like an actual terminal. `-h` is used to set the hostname of the container. It's mainly used to show what container we are currently in.

There is a `/proc` filesystem on Linux under which you can find the PIDs of all the running processes on the system. In bash, we can use `$$` to get the PID of the current process. Capabilities for a certain process are defined in a file called `status`, thus if we want to read this file we can do `cat /proc/$$/status`. This file contains quite a few things, so it might be handy to narrow down our search results to just the capabilities with `grep`.

```sh
$ cat /proc/$$/status | grep -i cap

CapInh: 00000000a80425fb
CapPrm: 00000000a80425fb
CapEff: 00000000a80425fb
CapBnd: 00000000a80425fb
CapAmb: 0000000000000000
```

> This is done with docker version 20.10.3, build 48d30b5

The returned output contains a couple of rows all starting with Cap, these are called capability sets. Each process or thread has five different capability sets defined. When reading up on capability sets you will often see that they use the terms processes or threads intertwined. Capabilities can have an effect on a process but also on the threads inside a process. For example, in a single-threaded process, you can have a look at the capabilities set for the main thread via `/proc/$$/task/$$/status`. For the sake of simplicity, I'm going to ignore these for now but do know that capabilities also apply to threads.

- CapInh: or inheritable capabilities are passed during program load as permitted set
- CapPrm: or permitted capabilities are capabilities that can be enabled in effective or in the inheritable set.
- CapEff: or effective are verified for each privileged action
- CapBnd: or bounding capabilities are a limiting superset, nothing more than this can ever be done
- CapAmb: or ambient capabilites are preserved during program load to pass capabilities

The most important of these are the effective capabilities thats where the kernel looks at when your program wants to take a specific action. The docker container we started in the example above is running as the root user, and as you can see it is already granted some capabilities.

bounding is the limiting superset, you can't have a any bits set in any of the other list that is not defined in the bounding set.

To learn how capabilities are passed down between process we need to understand a bit about how new processes are created in Linux. The following tries to explain how processes are created in linux in a nutshell

[todo add image here]()

As you can see to create a new process you need the `fork` system call. This creates a new process as an exact clone of the existing process. What this means for capabilities is that at this point our new process has exactly the same capabilities as our parent process. In order to load a new program in this process a system call `execve` is made. This will load the new code and data from the referenced program file, it's at this point that the kernel will recalculate set of capabilities for our new process. The easiest way for me to explain how capabilities are transferred during an `execve` call is by having a look at the capabilities man page:

```txt
Transformation of capabilities during execve()
    During an execve(2), the kernel calculates the new capabilities of the process using the following algorithm:

        P'(ambient)     = (file is privileged) ? 0 : P(ambient)

        P'(permitted)   = (P(inheritable) & F(inheritable)) |
                            (F(permitted) & P(bounding)) | P'(ambient)

        P'(effective)   = F(effective) ? P'(permitted) : P'(ambient)

        P'(inheritable) = P(inheritable)    [i.e., unchanged]

        P'(bounding)    = P(bounding)       [i.e., unchanged]

    where:

        P()   denotes the value of a thread capability set before the execve(2)

        P'()  denotes the value of a thread capability set after the execve(2)

        F()   denotes a file capability set
```

At this point we have only seen the masked value, it would be good to extract the capibility flags from it so have we have a more human friendly view over the active capabilities for a process. In order to figure this out let's turn to the Linux source code, the public api is defined in the uapi includes section. An it is [here](https://github.com/torvalds/linux/blob/3aaf0a27ffc29b19a62314edd684b9bc6346f9a8/include/uapi/linux/capability.h#L113) where we find a list of all capabilities defined in the kernel with their index. These indexed values don't allow us to extract enbaled flags from the bitmaks and we need to dig a bit deeper in the source to find out how this translation works. Digging a bit deeper into this file we can [see](https://github.com/torvalds/linux/blob/3aaf0a27ffc29b19a62314edd684b9bc6346f9a8/include/uapi/linux/capability.h#L429) how the tanslation actually works. Now that we have all the information at hand let's write a couple lines of Python code to print out what capabilities are enabled given a certain bitmask:

```py
import sys

from enum import Enum


class Capability(Enum):
    CAP_CHOWN = 0
    # ...
    CAP_CHECKPOINT_RESTORE = 40


def get_capabilities(caps):
    for cap in Capability:
        if caps & (1 << cap.value):
            yield cap.name


def main(args):
    caps = int(args[1], 16)

    for c in get_capabilities(caps):
        print(c)


if __name__ == "__main__":
    main(sys.argv)
```

> Not all capabilities are shown in the script to keep things compact and readable. I used the following command to create the python enum `curl -s https://raw.githubusercontent.com/torvalds/linux/3aaf0a27ffc29b19a62314edd684b9bc6346f9a8/include/uapi/linux/capability.h | grep -i '^#define CAP_.*[0-9]$' | awk '{ printf "%s=%s\n",$2,$3; }'`

The script allows passing a capability set as the first argument. Passes this to `get_capabilities` which loops through all capabilities in the enum left shifts the value to get the masked value and yields the capibility name if it is set. Running this script with the capabilities returned above we get the following:

```sh
$ python capshow.sh 00000000a80425fb

CAP_CHOWN
CAP_DAC_OVERRIDE
CAP_FOWNER
CAP_FSETID
CAP_KILL
CAP_SETGID
CAP_SETUID
CAP_SETPCAP
CAP_NET_BIND_SERVICE
CAP_NET_RAW
CAP_SYS_CHROOT
CAP_MKNOD
CAP_AUDIT_WRITE
CAP_SETFCAP
```

```sh
$ apt update && apt install libcap2-bin

$ capsh --decode=00000000a80425fb

0x00000000a80425fb=cap_chown,cap_dac_override,cap_fowner,cap_fsetid,cap_kill,cap_setgid,cap_setuid,cap_setpcap,cap_net_bind_service,cap_net_raw,cap_sys_chroot,cap_mknod,cap_audit_write,cap_setfcap
```

## Diving deep into capabilities

```sh
apt update
apt install iputils-ping net-tools netcat libcap2-bin curl sudo strace

useradd nick
passwd nick
usermod -aG sudo nick
```
