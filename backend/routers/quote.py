from fastapi import APIRouter
from fastapi.responses import JSONResponse
from services import quote_service

router = APIRouter()

@router.get("/quote")
def get_quote(tokenIn: str, tokenOut: str):
    quote_service_singleton = quote_service.QuoteService()
    data = quote_service_singleton.get_quote_service(tokenIn, tokenOut)
    if not data:
        return JSONResponse(status_code=404, content={"message": "Quote not found"})
    return JSONResponse(content=data.__dict__)
