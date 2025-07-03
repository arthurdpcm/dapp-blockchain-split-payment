import requests
import os
from dotenv import load_dotenv
import datetime
load_dotenv()

url = f"https://gateway.thegraph.com/api/subgraphs/id/EsLGwxyeMMeJuhqWvuLmJEiDKXJ4Z6YsoJreUnyeozco"
headers = {
    "Accept": "application/json",
    "Authorization": f"Bearer {os.getenv('THEGRAPH_API_TOKEN')}",
}

def first_day_of_month_timestamp() -> str:
    now = datetime.datetime.now(datetime.timezone.utc)
    first_day = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    return str(int(first_day.timestamp()))

def get_pool_by_pair(tokens0_in=None, tokens1_in=None):
    pool_ids = set()
    for token0 in tokens0_in:
        for token1 in tokens1_in:
            query = f"""
            {{
              pools(
                where: {{
                  token0_in: [\"{token0}\", \"{token1}\"],
                  token1_in: [\"{token0}\", \"{token1}\"]
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
                print(f"Error querying The Graph for pair {token0}/{token1}: {response.text}")
    return pool_ids

def get_swaps_for_pool(pool_id, date_from, date_to=None):
    all_swaps = []
    last_id = ""
    if not date_to: # get now in timestamp format
        date_to = str(int(datetime.datetime.now(datetime.timezone.utc).timestamp()))
      
    while True:
        query = f"""
        query($date_from: String!, $date_to: String!, $lastId: String!) {{
          pool(id: "{pool_id}") {{
            swaps(
              first: 1000,
              where: {{timestamp_gte: $date_from, timestamp_lte: $date_to, id_gt: $lastId}}
              orderBy: id
              orderDirection: asc
            ) {{
              id
              amount0
              amount1
              timestamp
              token0 {{ id symbol }}
              token1 {{ id symbol }}
            }}
          }}
        }}
        """
        variables = {"date_from": date_from, "date_to": date_to, "lastId": last_id}
        resp = requests.post(url, json={"query": query, "variables": variables}, headers=headers)
        if resp.ok:
            data = resp.json()
            swaps = []
            if (
                "data" in data and data["data"] and
                "pool" in data["data"] and data["data"]["pool"] and
                "swaps" in data["data"]["pool"]
            ):
                swaps = data["data"]["pool"]["swaps"]
                all_swaps.extend(swaps)
                if len(swaps) < 1000:
                    break
                last_id = swaps[-1]["id"]
            else:
                break
        else:
            break
    return all_swaps
  
  
def get_quote(token_in: str, token_out: str):
    # graphql to get the pool id with the highest volume for the given token pair and return the token0Price and token1Price
    
    query = f"""
    {{
      pools(
        orderBy: liquidity,
        orderDirection: desc,
        where:{{
          token0_in: [\"{token_in}\", \"{token_out}\"],
          token1_in: [\"{token_in}\", \"{token_out}\"]
        }}
      ) {{
        id
        token0Price
        token0 {{id}}
        token1Price
        token1 {{id}}
        feeTier
      }}
    }}
    """
    
    response = requests.post(url, json={"query": query}, headers=headers)
    if response.ok:
        json_data = response.json()
        if "data" in json_data and "pools" in json_data["data"]:
            pools = json_data["data"]["pools"]
            if pools:
                pool = pools[0]
                return {
                    "pool_id": pool["id"],
                    "token0id": pool["token0"]["id"],
                    "token0Price": pool["token0Price"],
                    "token1id": pool["token1"]["id"],
                    "token1Price": pool["token1Price"],
                    "feeTier": pool["feeTier"]
                }
    print(f"Error querying The Graph for quote: {response.text}")
    # If no pool found or error, return None
    return None