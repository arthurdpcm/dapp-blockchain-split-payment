from pydantic import BaseModel

class QuoteResponse(BaseModel):
    pool_id: str
    token0Price: float
    token1Price: float
    fee_tier: int
