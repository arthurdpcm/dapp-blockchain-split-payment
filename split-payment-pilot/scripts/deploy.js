const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [owner, taxWallet] = await hre.ethers.getSigners();

  console.log("Owner:", owner.address);
  console.log("Tax Wallet:", taxWallet.address);

  // Deploy dos tokens ERC20 customizados
  const Token = await hre.ethers.getContractFactory("Token");
  const tokenA = await Token.deploy("BRZ Token", "BRZ", hre.ethers.parseEther("100000"));
  await tokenA.waitForDeployment();

  const tokenB = await Token.deploy("USDT Token", "USDT", hre.ethers.parseEther("100000"));
  await tokenB.waitForDeployment();

  console.log("TokenA:", tokenA.target);
  console.log("TokenB:", tokenB.target);

  // Endereço do Uniswap V3 Router da polygon
  const uniswapRouter = "0xE592427A0AEce92De3Edee1F18E0157C05861564";

  // Deploy do SplitPayment atualizado
  const SplitPayment = await hre.ethers.getContractFactory("SplitPayment");
  const splitPayment = await SplitPayment.deploy(
    taxWallet.address,
    [tokenA.target] // lista de stablecoins
  );
  await splitPayment.waitForDeployment();
  console.log("SplitPayment:", splitPayment.target);

  // Aprovação dos tokens para o contrato SplitPayment
  await tokenA.connect(owner).approve(splitPayment.target, hre.ethers.parseEther("10000"));
  await tokenB.connect(owner).approve(splitPayment.target, hre.ethers.parseEther("10000"));

  const contractAddresses = {
    TokenA: tokenA.target,
    TokenB: tokenB.target,
    SplitPayment: splitPayment.target,
    UniswapRouter: uniswapRouter
  };

  fs.writeFileSync('./contract-addresses.json', JSON.stringify(contractAddresses, null, 2));
  console.log("✅ Endereços salvos em contract-addresses.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
