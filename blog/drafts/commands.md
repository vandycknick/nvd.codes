---
title: "Commands"
description: ""
date: 2022-07-15T20:00:00+01:00
categories: []
draft: true
cover: ../images/placeholder.png
---

# Living off the land in Linux for good or evil.

## List processes without ps

```sh
find -L /proc -mindepth 2 -maxdepth 2 -name exe -exec ls -lh {} \; 2>/dev/null
```

```sh
find /proc -mindepth 2 -maxdepth 2 -name exe -exec ls -lh {} \; 2>/dev/null  | awk '
    BEGIN {
        is_a_tty=system("test -t 1")

        if (is_a_tty==0) {
            cmd="stty size -F /dev/tty"
            cmd | getline tty_size; close(cmd)
            split(tty_size, sizes, " ")
            cols=sizes[2]
        }

        passwd_file="/etc/passwd"
        while ((getline line < passwd_file) > 0) {
            split(line, parts, ":")
            users[parts[3]] = parts[1]
        }
        close(passwd_file)

        for (u in users) print u, users[u]

        printf "%-8s %8s %s\n", "USER", "PID", "CMD"
    }
    {
        binary=$11
        split($9, pid_chunks, "/")
        pid=pid_chunks[3]
        cmdline_file="/proc/"pid"/cmdline"

        cmd=""
        while ((getline line < cmdline_file) > 0)
            cmd=cmd""line
        close(cmdline_file)

        split("hello", null_sub_workaround, "\0")

        if (length(null_sub_workaround) == 1) {
            gsub("\0", " ", cmd)
        }

        if (is_a_tty==0) cmd=substr(cmd, 1, cols - 18)

        status_file="/proc/"pid"/status"
        status=""
        while ((getline line < status_file) > 0)
            status=status""line
        close(status_file)

        match(status, /Uid:\t([0-9]*)/, uid_match)
        print status
        for (m in uid_match) print m, uid_match[m]

        user=users[uid_match[1]]
        if(length(user)>7) user=substr(user, 1, 7)"+"
        printf "%-8s %8i %s\n", user, pid, cmd
    }
'
```

## Pidof

```sh
function ppidof {
    find /proc -mindepth 2 -maxdepth 2 -name exe -exec ls -lh {} \; 2>/dev/null  | awk -v proc_name="$1\$" '
        BEGIN { ORS=" " }
        $0 ~ proc_name {
            split($9, pid_chunks, "/")
            pid=pid_chunks[3]
            print pid
        }
        END { printf "\n" }
    '
}

function ppidof {
    find /proc -mindepth 2 -maxdepth 2 -name exe -exec ls -lh {} \; 2>/dev/null  | awk -v proc_name="$1\$" '
        BEGIN { ORS=" " }
        {
            split($9, pid_chunks, "/")
            pid=pid_chunks[3]
            cmdline_file="/proc/"pid"/cmdline"

            cmd=""
            while ((getline line < cmdline_file) > 0) {
                cmd=cmd" "line
            }
            close(cmdline_file)

            split("hello", null_sub_workaround, "\0")

            if (length(null_sub_workaround) == 1) {
                gsub("\0", " ", cmd)
            }

            split(cmd, args, " ")
            first_arg=args[1]
        }
        first_arg ~ proc_name { print pid }
        END { printf "\n" }
    '
}

```

## Get the command line arguments of a process

```sh
tr \\0 ' ' < /proc/753798/cmdline; echo

awk '{ gsub(/\0/, " ", $1); printf "%s\n",$1 }' /proc/754977/cmdline
```

## netstat without netstat

```sh
awk '
    function hex_to_dec(str,ret,n,i,k,c) {
        ret = 0
        n = length(str)
        for (i = 1; i <= n; i++) {
            c = tolower(substr(str, i, 1))
            k = index("123456789abcdef", c)
            ret = ret * 16 + k
        }
        return ret
    }
    function get_ip(str,ret) {
        ret=hex_to_dec(substr(str,index(str,":")-2,2));
        for (i=5; i>0; i-=2) {
            ret = ret"."hex_to_dec(substr(str,i,2))
        }
        ret = ret":"hex_to_dec(substr(str,index(str,":")+1,4))
        return ret
    }
    # https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/include/net/tcp_states.h?id=HEAD
    function get_tcp_state(state) {
        state_dec=hex_to_dec(state)
        switch (state_dec) {
            case 1:
                return "ESTABLISHED"
            case 2:
                return "SYN_SENT"
            case 3:
                return "SYN_RECV"
            case 4:
                return "FIN_WAIT1"
            case 5:
                return "FIN_WAIT2"
            case 6:
                return "TIME_WAIT"
            case 7:
                return "CLOSE"
            case 8:
                return "CLOSE_WAIT"
            case 9:
                return "LAST_ACK"
            case 10:
                return "LISTEN"
            case 11:
                return "CLOSING"
            case 12:
                return "NEW_SYN_RECV"
            case 13:
                return "MAX_STATES"
            default:
                return ""
        }
    }
    BEGIN { printf "%-8s %-20s %-20s %s \n", "Proto", "Local Address", "Remote Address", "State" }
    FNR > 1 {
        local=get_ip($2)
        remote=get_ip($3);
        split(FILENAME, proto, "/")
        state=get_tcp_state($4)

        printf "%-8s %-20s %-20s %s \n", proto[4], local, remote, state
    }
' /proc/net/tcp /proc/net/tcp6 /proc/net/udp /proc/net/udp6
```

## Uname

```sh
function uname {
    cat /proc/version
}
```
