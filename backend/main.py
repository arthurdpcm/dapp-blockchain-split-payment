from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import quote, pools
from services.pool_scheduler import start_scheduler

app = FastAPI(
    title="Split Payment Service API",
    description="API to support the Split Payment DApp by providing off-chain data like token quotes from Uniswap V3.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"greeting": "Hello, World!", "message": "Welcome to FastAPI!"}

app.include_router(quote.router)
app.include_router(pools.router)

# start_scheduler()