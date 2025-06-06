import requests
import os
from dotenv import load_dotenv

def main():
    load_dotenv()
    url = "https://gateway.thegraph.com/api/subgraphs/id/CwpebM66AH5uqS5sreKij8yEkkPcHvmyEs7EwFtdM5ND"
    headers = {
        "Accept": "application/json",
        "Authorization": f"Bearer {os.getenv('JWT_API_TOKEN')}",
    }
    # USDT address (Polygon example)
    #usdt_address = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174".lower()
    #brla_polygon  = "0xe6a537a407488807f0bbeb0038b79004f19dddfb"
    #brz_polygon = 0x4ed141110f6eeeaba9a1df36d8c26f684d2475dc
    #usdc_polygon = 0x3c499c542cef5e3811e1192ce70d8cc03d5c3359
    tokens_addresses_dict = {
        "usdt_polygon": "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
        "brla_polygon": "0xe6a537a407488807f0bbeb0038b79004f19dddfb",
        "brz_polygon": "0x4ed141110f6eeeaba9a1df36d8c26f684d2475dc",
        "usdc_polygon": "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359"
    }
    
    token_address = tokens_addresses_dict["brla_polygon"]
    query = f"""
    {{
      pools(
        where: {{
          token0_in: ["{token_address}", "{tokens_addresses_dict['usdt_polygon']}"],
          token1_in: ["{token_address}", "{tokens_addresses_dict['usdt_polygon']}"]
        }}
      ) {{
        id
        liquidity
        volumeUSD
        token0 {{ name symbol id }}
        token1 {{ name symbol id }}
      }}
    }}
    """

    response = requests.post(url, json={"query": query}, headers=headers)
    if response.ok:
        json_data = response.json()
        if "data" in json_data and "pools" in json_data["data"]:
            pools = json_data["data"]["pools"]
            if pools:
                print(f"Found {len(pools)} pools for token {token_address}:")
                for pool in pools:
                    print(f"Pool ID: {pool['id']}")
                    print(f"  Liquidity: {pool.get('liquidity')}")
                    print(f"  Volume USD: {pool.get('volumeUSD')}")
                    print(f"  Token0: {pool['token0']['name']} ({pool['token0']['symbol']}) - {pool['token0']['id']}")
                    print(f"  Token1: {pool['token1']['name']} ({pool['token1']['symbol']}) - {pool['token1']['id']}")
                    print("---")
            else:
                print("No pools found for this token.")
        else:
            print("No data received:", json_data)
    else:
        print("Error querying The Graph:", response.text)

if __name__ == "__main__":
    main() 