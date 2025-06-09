import requests
import os
from dotenv import load_dotenv
import datetime

load_dotenv()

BRL_TOKENS = [
    "0xe6a537a407488807f0bbeb0038b79004f19dddfb",  # brla_polygon
    "0x4ed141110f6eeeaba9a1df36d8c26f684d2475dc",  # brz_polygon
]
USD_TOKENS = [
    "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",  # usdt_polygon
    "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",  # usdc_polygon
]

url = f"https://gateway.thegraph.com/api/subgraphs/id/CwpebM66AH5uqS5sreKij8yEkkPcHvmyEs7EwFtdM5ND"
headers = {
    "Accept": "application/json",
    "Authorization": f"Bearer {os.getenv('JWT_API_TOKEN')}",
}

def first_day_of_month_timestamp() -> str:
    now = datetime.datetime.now(datetime.timezone.utc)
    first_day = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    return str(int(first_day.timestamp()))

def get_brl_usd_pool_ids():
    pool_ids = set()
    for brl in BRL_TOKENS:
        for usd in USD_TOKENS:
            query = f"""
            {{
              pools(
                where: {{
                  token0_in: [\"{brl}\", \"{usd}\"],
                  token1_in: [\"{brl}\", \"{usd}\"]
                }}
              ) {{
                id
                liquidity
              }}
            }}
            """
            response = requests.post(url, json={"query": query}, headers=headers)
            if response.ok:
                json_data = response.json()
                if "data" in json_data and "pools" in json_data["data"]:
                    pools = json_data["data"]["pools"]
                    for pool in pools:
                        if pool.get("liquidity") and float(pool["liquidity"]) > 0:
                            pool_ids.add(pool["id"])
                elif "errors" in json_data:
                  print(json_data["errors"][0]["message"])
            else:
                print(f"Error querying The Graph for pair {brl}/{usd}: {response.text}")
    return pool_ids

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
  
