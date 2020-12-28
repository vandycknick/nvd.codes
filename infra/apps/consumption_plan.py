from typing import Tuple
from functools import lru_cache
from pulumi import ResourceOptions, Alias
from pulumi_azure import appservice, storage


@lru_cache(maxsize=1)
def get_consumption_plan(
    resource_group_name: str,
) -> Tuple[appservice.Plan, storage.Account]:
    plan = appservice.Plan(
        "nvd-funcs-consumption-plan",
        resource_group_name=resource_group_name,
        kind="functionapp",
        reserved=True,
        sku=appservice.PlanSkuArgs(tier="Dynamic", size="Y1",),
    )

    storage_account = storage.Account(
        "nvdfuncssa",
        resource_group_name=resource_group_name,
        account_kind="StorageV2",
        account_tier="Standard",
        account_replication_type="LRS",
        enable_https_traffic_only=True,
        min_tls_version="TLS1_2",
    )

    return plan, storage_account
