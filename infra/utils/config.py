from functools import lru_cache
from pulumi import Config


@lru_cache(maxsize=1)
def get_config() -> Config:
    config = Config(name="nvd-codes-infra")
    return config
