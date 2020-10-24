---
id: 0ae8916a-1a8b-44c4-8624-0e1404e717b1
title: Kong not supported on my old refurbished CPU
description: In this post I go through a problem I faced getting Kong API gateway up and running on an older CPU. I show how to debug the issue and how to determine if your CPU is supported
date: 2020-10-24T22:30:00+02:00
categories: [kong, api, proxy, cpu]
cover: ./assets/2020-10-24-kong-not-supported-on-my-old-refurbished-cpu/cover.jpg
---

I recently ran into an issue getting Kong up and running as ingress proxy on a Kubernetes cluster. The service kept crashing and restarting, making the pods go into a `CrashLoopBackOff`. Digging through the logs nothing really obvious stood out, mainly because there were absolutely no logs present. As it turned out Kong already crashed even before it was able to output any logs. While describing the pod using `kubeclt describe pod pod-name` I noticed the container exited with a 132 exit code. What does a 132 exit code mean? It could be many things but the important question to ask is what does it mean in the context of Kong.

Before I dive any deeper into this issue, let me give a bit more context about this specific cluster. I'm creating my own home automation system that is fully connected and integrated into my house. The main idea is to connect all my different IOT devices under one application. I'll write another post about it someday when I have more of the details fleshed out. For this system, I have a Kubernetes cluster running on some refurbished old hardware that I just had lying around collecting dust.

Searching the interwebs I bumped into a GitHub issue from 2018 describe the behaviour I was experiencing myself. Somewhere near the end, [this](https://github.com/Kong/docker-kong/issues/138#issuecomment-449423106) comment explains why Kong was crashing all so suddenly. As it turns out Kong needs a CPU that supports SSE4.2. Kong builds on top of a Lua package called [OpenResty](https://github.com/openresty/openresty), which is a web application server allowing to run scripts that interact with Nginx. It's exactly this package that is built with a hard requirement of having SSE4.2 available on your CPU.

SSE4 (Streaming SIMD Extensions 4) is a SIMD CPU instruction set used in the Intel and AMD processors. Streaming SIMD extensions are a set of extensions to the x86 instruction set and SSE4 is simply the 4th versions of extensions that were released. These extensions allow performing the same operation on multiple data points simultaneously all from a single instruction. The SSE4 extension became available starting with intel Nehalem processors, e.g. the Core-I series (1st generation).

To detect support for these extensions on a Linux machine you need to have a look at the `/proc/cpuinfo` file:

```bash
$ cat /proc/cpuinfo

processor       : 0
vendor_id       : GenuineIntel
cpu family      : 6
model           : 23
model name      : Pentium(R) Dual-Core  CPU      E5500  @ 2.80GHz
...
flags           : fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ht tm pbe syscall nx lm constant_tsc arch_perfmon pebs bts rep_good nopl cpuid aperfmperf pni dtes64 monitor ds_cpl vmx est tm2 ssse3 cx16 xtpr pdcm xsave lahf_lm pti tpr_shadow vnmi flexpriority dtherm
...
```

The output will show a section for each CPU core available on your machine. To verify if SSE4.2 is available you should check if it shows up as one of the flags (`sse4_2`). For my CPU this flag is not present because this extension is not available on an old Pentium processor.

## Conclusion

In this post, I walked through a problem I faced when running a Kong API Gateway on an older CPU. I showed how you can determine if your CPU is supported and what extension is required for it to run. From reading the OpenResty docs, it showed that it should be possible to compile OpenResty for servers that don't support it. I decided not to dive deeper into this option and chose to go with an Nginx proxy for the time being. This could be an option though if you really need to get Kong up and running on older hardware.