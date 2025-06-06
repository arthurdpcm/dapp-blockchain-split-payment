# https://thegraph.com/docs/en/supported-networks/matic/
# https://thegraph.com/docs/en/token-api/quick-start/
# KEY: pool-brl-token


import requests
import os
from dotenv import load_dotenv
import datetime
#https://thegraph.com/explorer/subgraphs/CwpebM66AH5uqS5sreKij8yEkkPcHvmyEs7EwFtdM5ND?view=Query&chain=arbitrum-one

# brz_address = "0x4eD141110F6EeeAbA9A1df36d8c26f684d2475Dc"

# address = '0x2a0c0dbecc7e4d658f48e01e3fa353f44050c208'

# {
#   token(id: "0xe6a537a407488807f0bbeb0038b79004f19dddfb") {
#     name
#     id
#     symbol
#     poolCount
#   }
#   pool(id: "0x1d84461ca1454bc0b8b2ad1bfd968575cd724e71e3656f970ea495f41215ab85") {
#     volumeToken0
#     swaps{
#       amount0
#       amountUSD
#       timestamp
#     }
#   }
# }

load_dotenv()

url = f"https://gateway.thegraph.com/api/subgraphs/id/CwpebM66AH5uqS5sreKij8yEkkPcHvmyEs7EwFtdM5ND"
headers = {
    "Accept": "application/json",
    "Authorization": f"Bearer {os.getenv('JWT_API_TOKEN')}",
}



query = """
query($startTimestamp: String!) {
  pool(id: "0x1d84461ca1454bc0b8b2ad1bfd968575cd724e71e3656f970ea495f41215ab85") {
    volumeToken0
    swaps(where: {timestamp_gte: $startTimestamp}) {
      amount0
      timestamp
      token0 {
        name
        symbol
        id
      }
      token1 {
        name
        symbol
        id
      }
    }
  }
  token(id: "0xe6a537a407488807f0bbeb0038b79004f19dddfb") {
    name
    id
    symbol
    poolCount
  }
}
"""

def first_day_of_month_timestamp() -> str:
    # Data atual em UTC (timezone-aware)
    now = datetime.datetime.now(datetime.timezone.utc)
    # Substitui o dia por 1 e horário por meia-noite
    first_day = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    # Converte para timestamp inteiro em segundos
    return str(int(first_day.timestamp()))

response = requests.post(url, json={"query": query, "variables": {"startTimestamp": first_day_of_month_timestamp()}}, headers=headers)

if response.ok:
    json_data = response.json()
    if "data" in json_data:
        data = json_data["data"]
        # Exibir informações do token
        if "token" in data and data["token"]:
            token = data["token"]
            print("--- Token ---")
            print(f"Nome: {token.get('name')}")
            print(f"ID: {token.get('id')}")
            print(f"Símbolo: {token.get('symbol')}")
            print()
        # Exibir informações do pool
        if "pool" in data and data["pool"]:
            pool = data["pool"]
            print("--- Pool ---")
            print(f"Volume Token0: {pool.get('volumeToken0')}")
            if "swaps" in pool and pool["swaps"]:
                print("Swaps:")
                for swap in pool["swaps"]:
                    print(f"  Amount0: {swap.get('amount0')}")
                    print(f"  Amount1: {swap.get('amount1')}")
                    # Garantir que o timestamp seja convertido corretamente para inteiro
                    raw_timestamp = swap.get('timestamp')
                    if raw_timestamp:
                        try:
                            ts_int = int(float(raw_timestamp))
                            dt = datetime.datetime.fromtimestamp(ts_int)
                            print(f"  Timestamp: {dt.strftime('%Y-%m-%d %H:%M:%S')}")
                        except Exception as e:
                            print(f"  Timestamp: {raw_timestamp} (erro ao converter)")
                    else:
                        print("  Timestamp: N/A")

                    if 'token0' in swap:
                        print(f"    Token0: {swap['token0'].get('name')} ({swap['token0'].get('symbol')}) - {swap['token0'].get('id')}")
                    if 'token1' in swap:
                        print(f"    Token1: {swap['token1'].get('name')} ({swap['token1'].get('symbol')}) - {swap['token1'].get('id')}")
                    print("  ---")
            else:
                print("Nenhum swap encontrado para este pool.")
        else:
            print("Nenhum pool encontrado.")
    else:
        print("Resposta recebida sem dados:", json_data)
else:
    print("Erro ao consultar The Graph:", response.text)