npx hardhat compile
npx hardhat test
npx hardhat coverage

npx hardhat node
npx hardhat run scripts/deploy.js --network localhost


## Interagir com o contrato
Você tem duas opções:

👉 Via Hardhat Console (REPL):
bash
Copiar
Editar
npx hardhat console --network localhost
Exemplo de interação:

javascript
Copiar
Editar
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const SplitPayment = await ethers.getContractFactory("SplitPayment");
const split = await SplitPayment.attach(contractAddress);

await split.taxWallet(); // Verificar o taxWallet

await splitPayment.isBrlStablecoin("0x...endereço_de_token...");



👉 Via scripts:
Crie scripts/interact.js:

javascript
Copiar
Editar
const { ethers } = require("hardhat");

async function main() {
  const [user] = await ethers.getSigners();

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const SplitPayment = await ethers.getContractFactory("SplitPayment");
  const split = await SplitPayment.attach(contractAddress);

  const tx = await split.splitPayment(
    "0xRecipientAddressHere",
    ethers.parseEther("1"),
    { value: ethers.parseEther("1") }
  );

  await tx.wait();

  console.log("Payment split executed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
Execute:

bash
Copiar
Editar
npx hardhat run scripts/interact.js --network localhost


wsl
foundry
anvil
uniswap local


cmd:
curl -L https://foundry.paradigm.xyz | bash
foundryup
anvil --version

anvil --fork-url https://polygon-rpc.com

mythril:
rodar no ubuntu
usei venv para rodar o mythril
python3 -m venv venv
source venv/bin/activate

(se nao tiver pip ou mythril)
pip install --upgrade pip
pip install mythril
criar arquivo solc-json.json para mapping dos imports


myth analyze SplitPayment.sol

ou
myth analyze contracts/SplitPayment.sol --solc-json solc-json.json -o markdown > mythil_analysis.md


const abi = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint)",
  "function transfer(address to, uint amount) returns (bool)"
];
const brz = new ethers.Contract("0x4ed141110f6eeeaba9a1df36d8c26f684d2475dc", abi, ethers.provider);

brz.symbol()



/mnt/c/Users/Arthur Duarte/Desktop/CEFET/Blockchain/dapp-blockchain-split-payment/piloto$ anvil --fork-url https://polygon-rpc.com

https://polygon-mainnet.infura.io/v3/[API-KEY]

https://thegraph.com/explorer/subgraphs/EsLGwxyeMMeJuhqWvuLmJEiDKXJ4Z6YsoJreUnyeozco?view=Query&chain=arbitrum-one




 const [owner] = await ethers.getSigners();
    const splitPaymentContract = await ethers.getContractAt(
      "SplitPayment",
      "0xB9d86f7faDDC177C41E1d3de8a7a21127a8018D2",
      owner
    );

          const tx5 = await splitPaymentContract.("0xe6a537a407488807f0bbeb0038b79004f19dddfb");
await tx5.wait()
          const tx2 = await splitPaymentContract.addValidStablecoin("0x4ed141110f6eeeaba9a1df36d8c26f684d2475dc");
await tx2.wait()
          const tx3 = await splitPaymentContract.addValidStablecoin("0x18ec0a6e18e5bc3784fdd3a3634b31245ab704f6");
          await tx3.wait()
          const tx4 = await splitPaymentContract.addValidStablecoin("0x3c499c542cef5e3811e1192ce70d8cc03d5c3359");
          await tx4.wait()
0xe6a537a407488807f0bbeb0038b79004f19dddfb
0x4ed141110f6eeeaba9a1df36d8c26f684d2475dc
0x18ec0a6e18e5bc3784fdd3a3634b31245ab704f6
0x3c499c542cef5e3811e1192ce70d8cc03d5c3359
