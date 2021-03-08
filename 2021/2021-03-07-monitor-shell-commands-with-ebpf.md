---
id: 85492f70-ffa0-4444-8d29-3035359d0c33
title: Monitor shell commands with eBPF
description: Ever wondered if it would be possible to monitor every command ever typed inside a shell prompt. In this post, I walk you through creating an eBPF program to monitor every shell command typed on a bash or zsh prompt.
date: 2021-03-07T20:00:00+01:00
categories: [linux, bpftrace, ebpf, internals]
cover: ./assets/2021-03-07-monitor-shell-commands-with-ebpf/cover.jpg
draft: true
---

Ever wondered if it would be possible to monitor any shell on you system and have it logs any command users are typing in it?

it's not really something you do for fun, instability of you whole Linux system just lures around the corner.

eBPF is a pretty powerful technology that allows you to extend or monitor the kernel in a safe manner. By safe here I mean that these programs are run in a virtual environment, making it impossible to cause system-wide instabilities. I think we are all too familiar with Windows BSOD's caused by drivers leaking memory or not properly checking some inputs causing a system to crash. Or even on Linux or MacOS you can have drivers wreaking havoc on the system causing all kinds of instabilities.

## Snooping on commands typed in bash

Let's start relatively simple and see if we can snoop any command typed in a bash shell. As you are probably already aware we are going to use a technology called eBPF to get this working. To make it easier to work with eBPF from the command line we'll need a tool called `bpftrace`. I'll explain what this is and how it works in relation to eBPF in a sec, but let's first get something up and running. On a Ubuntu-based system it's relatively straight forward to install `bpftrace`:

```sh
sudo apt install -y bpftrace
```

One of the cool things about `bpftrace` is that it comes with a bunch of amazing [tools](https://github.com/iovisor/bpftrace/tree/master/tools) already preinstalled. At this point, we are just one command away from achieving our goal. One of the preinstalled tools is named `bashreadline.bt` and it does exactly what we need. When run it starts monitoring every command entered in a bash shell. If `bpftrace` is installed, you should be able to find with:

```sh
$ which bashreadline.bt

/usr/sbin/bashreadline.bt
```

To execute an eBPF program you need to be root, which means if you are running as a normal user that you will need to prefix your command with sudo. Besides that you will also need the `CAP_SYS_ADMIN` capability, so if you are playing around with eBPF in a docker container make sure to add this capability because docker drops this one by default. This can be done by adding `--cap-add=SYS_ADMIN` to your docker run command. But beware about using this on a production system, the CAP_SYS_ADMIN capability is a key that opens a lot of doors for the root user.

```sh
$ sudo bashreadline.bt

Attaching 2 probes...
Tracing bash commands... Hit Ctrl-C to end.
TIME      PID    COMMAND
12:53:31  30543  ls
12:53:33  30543  date
12:54:04  30949  echo "hello world"
12:54:07  30949  sudo -s
12:54:30  31125  ps aux
12:54:47  30543  df -h
12:54:49  31125  dir
```

When run successfully you should see `bpftrace` compiling the script to eBPF byte code and attaching 2 probes to the kernel. At this point you should be able to walk up to any bash shell on your system and see the commands you type into it. As you can see from the example above the program logs every command that gets typed, shows the timestamp the command was run at and the process id where it originated from. Try elevating a shell as root (it's also what I did), you will see that it is even able to snoop commands run at an elevated prompt running as the root user. This is pretty scary stuff right and a very powerful one-liner. When executed it instruments all running bash shells immediately and even monitors new ones when they pop up. This means that you can walk up to any system that has never run eBPF before, and say "so what's getting executed in bash at the moment?", pretty scary stuff right.

## Looking under the covers

Let's dive into the script and try to figure out how it works. The script can be found in the bpftrace Github repo inside the tools [folder](https://github.com/iovisor/bpftrace/blob/master/tools/bashreadline.bt) and is pretty short.

```txt
BEGIN
{
    printf("Tracing bash commands... Hit Ctrl-C to end.\n");
    printf("%-9s %-6s %s\n", "TIME", "PID", "COMMAND");
}

uretprobe:/bin/bash:readline
{
    time("%H:%M:%S  ");
    printf("%-6d %s\n", pid, str(retval));
}
```

To read and understand this script we will need a quick primer in eBPF and bpftrace. We already know that eBPF allows us to run small programs in a VM inside the Linux kernel to instrument different parts of the system. bpftrace on the other hand is a higher-level language that with the help of LLVM allows us to compile these little scripts to BPF byte code. The language itself is inspired by awk and C, allowing us to write anything from complex program all to way to single nifty one-liners.

Via a set of probes, it allows you to instrument various layers of the Linux operating system.

![bpftrace probes](./assets/2021-03-07-monitor-shell-commands-with-ebpf/bpftrace_probes_2018.png)

In this post I'm not diving into all the different probes available, there is a good [reference guide](https://github.com/iovisor/bpftrace/blob/master/docs/reference_guide.md) available in the bpftrace repo if you are interested. The probe we are interested in here is the `uretprobe`, both `uprobe` and `uretprobe` allow instrumentation of user-level dynamic functions. This allows us to add some instrumentation around a user-level library or executable like libc or in this case bash. The syntax works as follows:

```
uprobe:library_name:function_name[+offset]
uprobe:library_name:address
uretprobe:library_name:function_name
```

`uprobes` instruments the beginning of a user-level function's execution, allowing us to inspect arguments passed into a function. `uretprobe` on the other hand instruments the end of a function call, giving access to its return value. From the syntax example above you can replace `library_name` with basically any executable on the system, which is what is being done in the bashreadline script.

With that short eBPF and bpftrace introduction out of the way let's have a look at how we can read commands enter at a bash command prompt. The bpftrace script installs a uretprobe for `/bin/bash` around a function named `readline`. In bash every command entered at the prompt gets returned by the readline function, hence why `uretprobe` is used. To list available uprobes, you can use any program to list the text segment symbols from a binary, such as `objdump` and `nm`. For example:

```sh
$ objdump -tT /bin/bash | grep readline

0000000000124e60 g    DO .bss   0000000000000008  Base        rl_readline_state
00000000000b7cc0 g    DF .text  0000000000000252  Base        readline_internal_char
00000000000b7190 g    DF .text  000000000000015f  Base        readline_internal_setup
0000000000087110 g    DF .text  000000000000004c  Base        posix_readline_initialize
00000000000b8520 g    DF .text  000000000000009a  Base        readline
0000000000124530 g    DO .bss   0000000000000004  Base        bash_readline_initialized
...
```

This lists a bunch of functions containing `readline` inside bash that we can use to instrument with `uprobe` or `uretprobe`. Trying this out we can write a single line program that prints a message each time a command is entered inside bash:

```sh
➜  bin sudo bpftrace -e 'uretprobe:/bin/bash:readline { printf("read a line\n"); }'
Attaching 1 probe...
read a line
read a line
read a line
read a line
^C
```

And this is basically everything there is to it, the actual script itself uses the BEGIN probe to create a neat little header.


## Port bashreadline to zsh

As you might have noticed when running bashreadline or after the deep dive, this only works for bash processes. For example, if you are a ZSH user, this script won't work as no commands will show up when running the monitor. The readline function call is specific to bash so let's have a look at how we can port this script for it to work with zsh.

Let's figure out if there is a `readline` alternative in zsh. The function is also available as a command from the shell so let's start from there. According to [stackexchange](https://unix.stackexchange.com/questions/373322/make-zsh-use-readline-instead-of-zle), zsh doesn't use readline (which is what we expected already) but instead using something called zle. Let's dig through the zsh binary there is a function named zle that we can use to hook into:

```sh
$ objdump -tT /usr/bin/zsh | grep zle

0000000000054570 g    DF .text  0000000000000262  Base        zleentry
000000000006f920 g    DF .text  0000000000000039  Base        zlevarsetfn
00000000000e57a0 g    DO .bss   0000000000000004  Base        zlemetacs
00000000000e51c0 g    DO .bss   0000000000000008  Base        zle_entry_ptr
00000000000e57bc g    DO .bss   0000000000000004  Base        zlemetall
00000000000e51c8 g    DO .bss   0000000000000004  Base        zle_load_state
00000000000e4ee0 g    DO .bss   0000000000000004  Base        zleactive
00000000000e5080 g    DO .bss   0000000000000008  Base        zle_chline
```

The `zleentry` function looks interesting, digging through the zsh source code mirror on [github](https://github.com/zsh-users/zsh/search?q=zleentry) we get a couple of hits. From the results, it seems that this function serves multiple purposes all controlled by this [enum](https://github.com/zsh-users/zsh/blob/00d20ed15e18f5af682f0daec140d6b8383c479a/Src/zsh.h#L3253) value. When given `ZLE_CMD_READ` or 1 it reads the enter command and returns this value, which means that this combination works exactly like the `readline` function from bash. So let's take a stab at implementing this for zsh, we can reuse most parts from the bash script:

```txt
BEGIN
{
    printf("Tracing zsh commands... Hit Ctrl-C to end.\n");
    printf("%-9s %-6s %s\n", "TIME", "PID", "COMMAND");
}

uretprobe:/usr/bin/zsh:zleentry
{
    time("%H:%M:%S  ");
    printf("%-6d %s\n", pid, str(retval));
}

```

This is mostly just a copy and paste from the bashreadline script replacing the `library_name` name with /usr/bin/zsh (use `which zsh` to find the path to your zsh installation) and the `function_name` with `zleentry`.

```sh
$ sudo bpftrace ./zshreadline

Attaching 2 probes...
Tracing zsh commands... Hit Ctrl-C to end.
TIME      PID    COMMAND
00:06:28  17120
00:06:28  17120
00:06:28  17120
00:06:28  17120
00:06:35  17120  ps aux

00:06:38  17120
00:06:38  17120
00:06:38  17120
00:06:38  17120
00:06:38  17120
00:06:42  17120  cat /proc/$$/status | grep -i cap
```

There are lots of empty lines in there and seems that lots of action on the zsh prompt trigger an event that gets processed by our bpftrace program. We noticed before that the `zleentry` function has many usages, so those extra lines are probably due to those other instances that are not returning any value. Let's quickly try to verify this by writing a small uprobe one-liner:

```sh
$ sudo bpftrace -e 'uprobe:/usr/bin/zsh:zleentry { printf("arg0: %d\n", arg0); }'

Attaching 1 probe...
arg0: 2
arg0: 2
arg0: 2
arg0: 2
arg0: 2
arg0: 2
arg0: 1
arg0: 2
```

This prints the first argument passed to the zleentry function, when you give this a try you will notice it starts printing lot's of 2's even before you execute your command. The second enum value is `ZLE_CMD_ADD_TO_LINE`, this is not the function call we are interested in. We are only interested in `ZLE_CMD_READ` or 1, which is when a command is executed. bpftrace allows us to write a [filter](https://github.com/iovisor/bpftrace/blob/master/docs/reference_guide.md#2--filtering) but when using `uretprobe` we don't have access to the arguments passed to the function. So the best I came up with is to filter and exclude any values when the `zleentry` function returns an empty string:

```sh
$ sudo bpftrace ./zshreadline

Attaching 2 probes...
Tracing zsh commands... Hit Ctrl-C to end.
TIME      PID    COMMAND
00:15:56  17120  ps aux
00:15:58  17120  dir
00:16:00  17120  echo hello
00:16:15  20992  exit
00:16:17  16028  ps aux
```

This works like a charm, we now have the same monitor function for zsh which allows us to monitor any command getting run on any zsh prompt running on our system.

## Conclusion

I hope this gives you some idea of the power that eBPF unlocks related to monitoring and instrumenting the Linux kernel. There are many more tools inside bpftrace that you can use for whatever you need. You can image a real world scenario where you use `bashreadline` or `zshsnoop` to monitor for unauthorized access. Which can trigger an alarm or whatever you prefer once you combine this with other tools you have endless possibilities. Maybe you can combine it with [ttysnoop](https://github.com/iovisor/bcc/blob/master/tools/ttysnoop.py), this allows you to capture all input and output over a tty session. So if an attacker gets a shell prompt you will have a full live view of what is happening on the system. I have become
