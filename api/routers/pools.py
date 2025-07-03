from fastapi import APIRouter
from services.pool_scheduler import get_brl_usd_swaps_cached, get_pool_cached
from models.pool import PoolSwapSummary
from fastapi.responses import JSONResponse

router = APIRouter()

@router.get("/brl-usd-swaps", response_model=list[PoolSwapSummary])
def brl_usd_swaps():
    data = get_brl_usd_swaps_cached()
    if not data:
        return JSONResponse(status_code=404, content={"message": "No swaps found"})
    return JSONResponse(content=[d.model_dump() for d in data])

@router.get("/pool/{pool_id}")
def get_pool(pool_id: str, dateFrom: str | None = None, dateTo: str | None = None):
    data = get_pool_cached(pool_id, date_from=dateFrom, date_to=dateTo)
    if not data:
        return JSONResponse(status_code=404, content={"message": "Pool not found"})
    return JSONResponse(content=data)