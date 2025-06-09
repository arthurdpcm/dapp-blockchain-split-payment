from fastapi import APIRouter
from services.pool_monitor import PoolMonitorService
from models.pool import PoolSwapSummary
from fastapi.responses import JSONResponse

router = APIRouter()

@router.get("/brl-usd-swaps", response_model=list[PoolSwapSummary])
def brl_usd_swaps():
    data = PoolMonitorService().get_brl_usd_swaps()
    return JSONResponse(content=[d.model_dump() for d in data])

# @router.get("/get-pool/{poolId}")
# def get_pool(poolId):
#     data = PoolMonitorService().get_pool(poolId)
#     return JSONResponse(data)