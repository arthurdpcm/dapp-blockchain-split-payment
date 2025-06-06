import requests
import os
from dotenv import load_dotenv

# List all BRL and USD stablecoins you want to check pairs for
BRL_TOKENS = [
    "0xe6a537a407488807f0bbeb0038b79004f19dddfb",  # brla_polygon
    "0x4ed141110f6eeeaba9a1df36d8c26f684d2475dc",  # brz_polygon
]
USD_TOKENS = [
    "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",  # usdt_polygon
    "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",  # usdc_polygon
]

def get_brl_usd_pool_ids():
    load_dotenv()
    url = "https://gateway.thegraph.com/api/subgraphs/id/CwpebM66AH5uqS5sreKij8yEkkPcHvmyEs7EwFtdM5ND"
    headers = {
        "Accept": "application/json",
        "Authorization": f"Bearer {os.getenv('JWT_API_TOKEN')}",
    }
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
                        # Only include pools with nonzero liquidity
                        if pool.get("liquidity") and float(pool["liquidity"]) > 0:
                            pool_ids.add(pool["id"])
            else:
                print(f"Error querying The Graph for pair {brl}/{usd}: {response.text}")
    return pool_ids

def main():
    for pid in get_brl_usd_pool_ids():
        print(pid)

if __name__ == "__main__":
    main() 