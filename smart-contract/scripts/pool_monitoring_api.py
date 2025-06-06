from fastapi import FastAPI
from fastapi.responses import JSONResponse
import requests
import os
from dotenv import load_dotenv
import datetime
from get_token_pools import get_brl_usd_pool_ids, BRL_TOKENS, USD_TOKENS

app = FastAPI()

load_dotenv()

url = f"https://gateway.thegraph.com/api/subgraphs/id/CwpebM66AH5uqS5sreKij8yEkkPcHvmyEs7EwFtdM5ND"
headers = {
    "Accept": "application/json",
    "Authorization": f"Bearer {os.getenv('JWT_API_TOKEN')}",
}

def first_day_of_month_timestamp() -> str:
    now = datetime.datetime.now(datetime.timezone.utc)
    first_day = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    return str(int(first_day.timestamp()))

def get_swaps_for_pool(pool_id, start_timestamp):
    query = f"""
    query($startTimestamp: String!) {{
      pool(id: \"{pool_id}\") {{
        swaps(where: {{timestamp_gte: $startTimestamp}}) {{
          amount0
          amount1
          timestamp
          token0 {{ id symbol }}
          token1 {{ id symbol }}
        }}
      }}
    }}
    """
    resp = requests.post(url, json={"query": query, "variables": {"startTimestamp": start_timestamp}}, headers=headers)
    if resp.ok:
        data = resp.json()
        if "data" in data and data["data"] and "pool" in data["data"] and data["data"]["pool"]:
            return data["data"]["pool"].get("swaps", [])
    return []

def is_brl_to_usd_swap(swap):
    token0 = swap["token0"]["id"].lower()
    token1 = swap["token1"]["id"].lower()
    amount0 = float(swap["amount0"])
    amount1 = float(swap["amount1"])
    if token0 in BRL_TOKENS and token1 in USD_TOKENS and amount0 < 0:
        return True, abs(amount0)
    if token1 in BRL_TOKENS and token0 in USD_TOKENS and amount1 < 0:
        return True, abs(amount1)
    return False, 0.0

@app.get("/brl-usd-swaps")
def brl_usd_swaps():
    start_timestamp = first_day_of_month_timestamp()
    pool_ids = get_brl_usd_pool_ids()
    results = []
    for pool_id in pool_ids:
        swaps = get_swaps_for_pool(pool_id, start_timestamp)
        total_brl_to_usd = 0.0
        token0 = swaps[0]["token0"]["symbol"] if swaps else None
        token1 = swaps[0]["token1"]["symbol"] if swaps else None
        for swap in swaps:
            is_brl_usd, brl_amount = is_brl_to_usd_swap(swap)
            if is_brl_usd:
                total_brl_to_usd += brl_amount
        results.append({
            "pool_id": pool_id,
            "token0": token0,
            "token1": token1,
            "total_brl_to_usd": total_brl_to_usd
        })
    return JSONResponse(content=results) 