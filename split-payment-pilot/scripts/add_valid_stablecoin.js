const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  // --- CONFIGURATION ---
  const addresses = require("../contract-addresses.json");
  const BRL_STABLECOINS = [
    { symbol: 'BRLA',
      name: 'Brazilian Digital Real',
      address: '0xe6a537a407488807f0bbeb0038b79004f19dddfb',
      image: '/brla_logo.png',
      decimals: 18
    },
    { symbol: 'BRZ',
      name: 'Brazilian Digital Token',
      address: '0x4ed141110f6eeeaba9a1df36d8c26f684d2475dc',
      image: '/brz_logo.png' ,
      decimals: 18
    },
    {
      symbol: 'MATIC',
      name: 'Matic Token',
      address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
      image: '/polygon_logo.png',
      decimals: 18
    },
    {
      symbol: 'EURE',
      name: 'Monerium EUR emoney',
      address: '0x18ec0a6e18e5bc3784fdd3a3634b31245ab704f6',
      image: '/eure_logo.png',
      decimals: 18
    },
    { symbol: 'USDC',
      name: 'USD Coin',
      address: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
      image: '/usdc_logo.png',
      decimals: 6
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