import re
import enum
import argparse
import functools

# Capabilities generated with
# curl -s https://raw.githubusercontent.com/torvalds/linux/3aaf0a27ffc29b19a62314edd684b9bc6346f9a8/include/uapi/linux/capability.h | grep -i '^#define CAP_.*[0-9]$' | awk '{ printf "%s=%s\n",$2,$3; }'
class Capability(enum.Enum):
    CAP_CHOWN = 0
    CAP_DAC_OVERRIDE = 1
    CAP_DAC_READ_SEARCH = 2
    CAP_FOWNER = 3
    CAP_FSETID = 4
    CAP_KILL = 5
    CAP_SETGID = 6
    CAP_SETUID = 7
    CAP_SETPCAP = 8
    CAP_LINUX_IMMUTABLE = 9
    CAP_NET_BIND_SERVICE = 10
    CAP_NET_BROADCAST = 11
    CAP_NET_ADMIN = 12
    CAP_NET_RAW = 13
    CAP_IPC_LOCK = 14
    CAP_IPC_OWNER = 15
    CAP_SYS_MODULE = 16
    CAP_SYS_RAWIO = 17
    CAP_SYS_CHROOT = 18
    CAP_SYS_PTRACE = 19
    CAP_SYS_PACCT = 20
    CAP_SYS_ADMIN = 21
    CAP_SYS_BOOT = 22
    CAP_SYS_NICE = 23
    CAP_SYS_RESOURCE = 24
    CAP_SYS_TIME = 25
    CAP_SYS_TTY_CONFIG = 26
    CAP_MKNOD = 27
    CAP_LEASE = 28
    CAP_AUDIT_WRITE = 29
    CAP_AUDIT_CONTROL = 30
    CAP_SETFCAP = 31
    CAP_MAC_OVERRIDE = 32
    CAP_MAC_ADMIN = 33
    CAP_SYSLOG = 34
    CAP_WAKE_ALARM = 35
    CAP_BLOCK_SUSPEND = 36
    CAP_AUDIT_READ = 37
    CAP_PERFMON = 38
    CAP_BPF = 39
    CAP_CHECKPOINT_RESTORE = 40


def capability_to_mask(capability_index):
    return 1 << capability_index


def get_capabilities(caps):
    for cap in Capability:
        if caps & capability_to_mask(cap.value):
            yield cap.name


def get_max_capability():
    return functools.reduce(
        lambda a, b: a | b, [capability_to_mask(cap.value) for cap in Capability]
    )


def get_capability_sets(pid):
    pattern = re.compile("(Cap[A-z]+):\s([0-9a-fA-F]+)", re.MULTILINE | re.IGNORECASE)
    capability_set = {}

    with open(f"/proc/{pid}/status") as status_file:
        for line in status_file.readlines():
            for match in re.finditer(pattern, line):
                capability_set[match.group(1)] = int(match.group(2), 16)

    return capability_set


def get_human_readable_capabilities(cap_set):
    max_capability = get_max_capability()
    return (
        ",".join(get_capabilities(cap_set)).lower() or "none"
        if cap_set != max_capability
        else "all"
    )


def main(args):
    capability_set = get_capability_sets(args.pid)

    for _set in capability_set.items():
        caps = (
            "{0:#0{1}x}".format(_set[1], 18)
            if args.human_readable is False
            else get_human_readable_capabilities(_set[1])
        )
        print(f"{_set[0]} = {caps}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Parse capabilities.")

    parser.add_argument(
        "-p",
        "--pid",
        default="self",
        help="process id (defaults to current python process)",
    )

    parser.add_argument(
        "-H",
        "--human-readable",
        action="store_true",
        help="show human readable values",
    )

    args = parser.parse_args()
    main(args)
