const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [owner] = await hre.ethers.getSigners();

  console.log("Owner:", owner.address);
  taxWalletAddress = "0x6da9b5d674c8Ad410C95De7b289558dA6cdF5d17"
  console.log("Tax Wallet:", taxWalletAddress);

  // Endereço do Uniswap V3 Router da polygon
  const uniswapRouter = "0xE592427A0AEce92De3Edee1F18E0157C05861564";

  // Deploy do SplitPayment atualizado
  const SplitPayment = await hre.ethers.getContractFactory("SplitPayment");
  const splitPayment = await SplitPayment.deploy(
    taxWalletAddress,
    [],
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
  fs.writeFileSync(path.join(contractsDir, 'contracts-addresses.json'), JSON.stringify(contractAddresses, null, 2));
  // get abi of splitPayment contract and token contract from artifacts folder and save in frontend/src/constants
  const splitPaymentAbi = fs.readFileSync(path.join(__dirname, '../artifacts/contracts/SplitPayment.sol/SplitPayment.json'), 'utf8');
  const tokenAbi = fs.readFileSync(path.join(__dirname, '../artifacts/contracts/Token.sol/Token.json'), 'utf8');
  fs.writeFileSync(path.join(contractsDir, '/abi/SplitPayment.json'), splitPaymentAbi);
  fs.writeFileSync(path.join(contractsDir, '/abi/Token.json'), tokenAbi);
  console.log("✅ Endereços salvos em contract-addresses.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
