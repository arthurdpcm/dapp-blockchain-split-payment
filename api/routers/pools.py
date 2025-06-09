from fastapi import APIRouter
from services.pool_monitor import PoolMonitorService
from models.pool import PoolSwapSummary
from fastapi.responses import JSONResponse

router = APIRouter()

@router.get("/brl-usd-swaps", response_model=list[PoolSwapSummary])
def brl_usd_swaps():
    data = PoolMonitorService().get_brl_usd_swaps()
    if not data:
        return JSONResponse(status_code=404, content={"message": "No swaps found"})
    return JSONResponse(content=[d.model_dump() for d in data])

@router.get("/pool/{pool_id}")
def get_pool(pool_id):
    data = PoolMonitorService().get_pool(pool_id)
    if not data:
        return JSONResponse(status_code=404, content={"message": "Pool not found"})
    return JSONResponse(data)