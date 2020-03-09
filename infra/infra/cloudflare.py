from pulumi import Output, ResourceOptions
from pulumi_cloudflare import Record


class DnsRecord:
    def __init__(self, main: Record, verify: Record):
        self.name = main.name
        self.main = main
        self.verify = verify


def create_dns_record(
    name: str, domain: str, zone_id: str, value: Output, verify="awverify"
):
    record_name = ".".join([name, domain]).strip(".")

    main_record = Record(
        record_name if name != "" else domain,
        name=name if name != "" else domain,
        ttl=1,
        type="CNAME",
        zone_id=zone_id,
        proxied=True,
        value=value,
    )

    verify_record = Record(
        "{}.{}".format(verify, record_name),
        name=".".join([verify, name]).strip("."),
        ttl=1,
        type="CNAME",
        zone_id=zone_id,
        proxied=False,
        value=Output.concat(verify, ".", value),
    )

    return DnsRecord(main_record, verify_record)
