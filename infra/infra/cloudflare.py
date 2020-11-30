from pulumi import Output, ResourceOptions
from pulumi_cloudflare import Record
from typing import Optional

from infra.utils import get_config


def create_cname_record(
    name: Optional[str], zone_id: str, value: Output, proxied: bool = True
) -> Record:
    domain = get_config().require("domain")
    full_domain = f"{name or ''}.{domain}".strip(".")

    main_record = Record(
        full_domain,
        name=name if name is not None else full_domain,
        ttl=1,
        type="CNAME",
        zone_id=zone_id,
        proxied=proxied,
        value=value,
    )

    return main_record
