const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  // --- CONFIGURATION ---
  const addresses = require("../contract-addresses.json");
  const BRL_STABLECOINS = [
    { symbol: 'USDC_Testnet',
    name: 'USD Coin',
    address: '0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582',
    image: '/usdc_logo.png',
    decimals: 6
  },
  { symbol: 'BRZ_TESTNET',
    name: 'Brazilian Digital Token',
    address: '0x13c90ba1f2cf2818af3e10c94878393683738899', // testnet 
    image: '/brz_logo.png' ,
    decimals: 18
  },
  ];

  // --- INITIALIZATION ---
  console.log("Initializing script...");
  const [owner] = await ethers.getSigners();
  const splitPayment = await ethers.getContractAt("SplitPayment", addresses.SplitPayment);
  for (const coin of BRL_STABLECOINS) {
    if (!(await splitPayment.isValidStablecoin(coin.address))) {
      console.log(`${coin.symbol} not registered. Adding to valid stablecoins...`);
      await splitPayment.connect(owner).addValidStablecoin(coin.address);
      console.log(`${coin.symbol} added successfully.`);
    } else {
      console.log(`${coin.symbol} is already registered as a valid stablecoin.`);
    }
  }

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});