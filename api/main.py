from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import pools
from services.pool_scheduler import start_scheduler

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pools.router)

start_scheduler()