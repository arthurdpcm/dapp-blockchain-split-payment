class QuoteResponse:
    def __init__(self, pool_id: str, token0Price: float, token1Price: float, fee_tier: int):
        self.pool_id = pool_id
        self.token0Price = token0Price
        self.token1Price = token1Price
        self.fee_tier = fee_tier