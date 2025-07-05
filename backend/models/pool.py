class PoolSwapSummary:
    def __init__(self, pool_id: str, token0: str | None, token1: str | None, total_brl_to_usd: float):
        self.pool_id = pool_id
        self.token0 = token0
        self.token1 = token1
        self.total_brl_to_usd = total_brl_to_usd