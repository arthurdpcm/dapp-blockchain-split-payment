from pydantic import BaseModel

class PoolSwapSummary(BaseModel):
    pool_id: str
    token0: str | None
    token1: str | None
    total_brl_to_usd: float 