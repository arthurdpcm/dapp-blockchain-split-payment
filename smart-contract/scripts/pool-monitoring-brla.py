# https://thegraph.com/docs/en/supported-networks/matic/
# https://thegraph.com/docs/en/token-api/quick-start/
# KEY: pool-brl-token
import requests
import dotenv

#https://thegraph.com/explorer/subgraphs/CwpebM66AH5uqS5sreKij8yEkkPcHvmyEs7EwFtdM5ND?view=Query&chain=arbitrum-one


# brz_address = "0x4eD141110F6EeeAbA9A1df36d8c26f684d2475Dc"

# address = '0x2a0c0dbecc7e4d658f48e01e3fa353f44050c208'


url = f"https://gateway.thegraph.com/api/subgraphs/id/CwpebM66AH5uqS5sreKij8yEkkPcHvmyEs7EwFtdM5ND"
headers = {
    "Accept": "application/json",
    "Authorization": f"Bearer {dotenv.get('JWT_API_TOKEN')}",
}
query = """
{
  token(id: "0xe6a537a407488807f0bbeb0038b79004f19dddfb") {
    name
    id
    symbol
    poolCount
  }
  pools(where: {token0: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"}) {
    id
    liquidity
    volumeUSD
    volumeToken0
    volumeToken1
    token0 {
      name
      id
      symbol
    }
    token1 {
      name
      id
      symbol
    }
  }
}
"""

response = requests.post(url, json={"query": query}, headers=headers)

if response.ok:
    json_data = response.json()
    if "data" in json_data and "pools" in json_data["data"]:
        data = json_data["data"]["pools"]
        if data:
            for pool in data:
                print(f"Pool ID: {pool['id']} | {pool['token0']['symbol']} / {pool['token1']['symbol']}")
                print(f"Liquidity: {pool['liquidity']} | Volume USD: {pool['volumeUSD']}")
                print("---")
        else:
            print("Nenhum pool encontrado com BRZ.")
    else:
        print("Resposta recebida sem dados:", json_data)
else:
    print("Erro ao consultar The Graph:", response.text)