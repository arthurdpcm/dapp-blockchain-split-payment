const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
const validStablecoins = [
  "0xe6a537a407488807f0bbeb0038b79004f19dddfb", // BRLA
  "0x4ed141110f6eeeaba9a1df36d8c26f684d2475dc", // BRZ
  "0x18ec0a6e18e5bc3784fdd3a3634b31245ab704f6", // EURE
  "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359"  // USDC
];

async function main() {
  const [owner] = await hre.ethers.getSigners();

  console.log("Owner:", owner.address);
  taxWalletAddress = "0x6da9b5d674c8Ad410C95De7b289558dA6cdF5d17";
  console.log("Tax Wallet:", taxWalletAddress);

  // Endereço do Uniswap V3 Router da polygon
  const uniswapRouter = "0xE592427A0AEce92De3Edee1F18E0157C05861564";

  // Deploy do SplitPayment atualizado
  const SplitPayment = await hre.ethers.getContractFactory("SplitPayment");
  const splitPayment = await SplitPayment.deploy(
    taxWalletAddress,
    validStablecoins,
    uniswapRouter
  );
  await splitPayment.waitForDeployment();
  console.log("SplitPayment:", splitPayment.target);

  const contractAddresses = {
    SplitPayment: splitPayment.target,
    TaxWallet: taxWalletAddress,
  };

  fs.writeFileSync('./contract-addresses.json', JSON.stringify(contractAddresses, null, 2));

  // Ensure the directory exists before writing the file
  
  const contractsDir = path.resolve(__dirname, '../../frontend/src/constants');
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }
  fs.writeFileSync(path.join(contractsDir, 'contracts-addresses_local.json'), JSON.stringify(contractAddresses, null, 2));
  // get abi of splitPayment contract and token contract from artifacts folder and save in frontend/src/constants
  const splitPaymentAbi = fs.readFileSync(path.join(__dirname, '../artifacts/contracts/SplitPayment.sol/SplitPayment.json'), 'utf8');
  const tokenAbi = fs.readFileSync(path.join(__dirname, '../artifacts/contracts/Token.sol/Token.json'), 'utf8');
  fs.writeFileSync(path.join(contractsDir, '/abi/SplitPayment.json'), splitPaymentAbi);
  fs.writeFileSync(path.join(contractsDir, '/abi/Token.json'), tokenAbi);
  console.log("✅ Endereços salvos em contracts-addresses_local.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
