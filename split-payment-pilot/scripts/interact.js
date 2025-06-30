const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  // --- CONFIGURATION ---
  const addresses = require("../contract-addresses.json");
  const EURE_ADDRESS = "0x18ec0A6E18E5bc3784fDd3a3634b31245ab704F6"; // EURE on Polygon
  const USDC_ADDRESS = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"; // USDC on Polygon
  const EURE_WHALE_ADDRESS = "0xBA12222222228d8Ba445958a75a0704d566BF2C8"; // A known account with a lot of EURE

  // --- INITIALIZATION ---
  console.log("Initializing script...");
  const [owner, taxWallet, user] = await ethers.getSigners();
  const splitPayment = await ethers.getContractAt("SplitPayment", addresses.SplitPayment);
  const eure = await ethers.getContractAt("Token", EURE_ADDRESS);

  console.log("Owner address:          ", owner.address);
  console.log("Tax Wallet address:     ", await splitPayment.taxWallet());
  console.log("User address:           ", user.address);
  console.log("SplitPayment contract:  ", splitPayment.target);
  console.log("EURE token contract:    ", eure.target);

  // --- STABLECOIN MANAGEMENT ---
  console.log("\n--- Step 1: Stablecoin Management ---");
  if (!(await splitPayment.isValidStablecoin(EURE_ADDRESS))) {
    console.log("EURE not registered. Adding to valid stablecoins...");
    await splitPayment.connect(owner).addValidStablecoin(EURE_ADDRESS);
    console.log("EURE added successfully.");
  } else {
    console.log("EURE is already registered as a valid stablecoin.");
  }

  // --- FUND USER ACCOUNT ---
  console.log("\n--- Step 2: Funding User Account ---");
  const amountToFund = ethers.parseUnits("100", 18); // 100 EURE
  console.log(`Impersonating whale (${EURE_WHALE_ADDRESS}) to fund user account...`);
  await network.provider.request({ method: "hardhat_impersonateAccount", params: [EURE_WHALE_ADDRESS] });
  const whaleSigner = await ethers.getSigner(EURE_WHALE_ADDRESS);
  await eure.connect(whaleSigner).transfer(user.address, amountToFund);
  await network.provider.request({ method: "hardhat_stopImpersonatingAccount", params: [EURE_WHALE_ADDRESS] });
  console.log(`User account funded with ${ethers.formatUnits(amountToFund, 18)} EURE.`);
  console.log(`Current EURE balance: ${ethers.formatUnits(await eure.balanceOf(user.address), 18)}`);

  // --- APPROVAL ---
  console.log("\n--- Step 3: Approve Token Spending ---");
  const amountIn = ethers.parseUnits("1", 18); // 1 EURE to be swapped
  console.log(`Approving SplitPayment contract to spend ${ethers.formatUnits(amountIn, 18)} EURE...`);
  await eure.connect(user).approve(splitPayment.target, amountIn);
  console.log("Approval successful.");

  // --- SWAP EXECUTION ---
  console.log("\n--- Step 4: Executing Swap ---");
  const fee = 3000; // 0.3% fee tier
  console.log("Calling splitAndSwapPayment...");
  try {
    const tx = await splitPayment.connect(user).splitAndSwapPayment(
      EURE_ADDRESS,
      amountIn,
      USDC_ADDRESS,
      fee
    );
    console.log("Transaction sent! Hash:", tx.hash);
    await tx.wait();
    console.log("Transaction confirmed successfully!");
  } catch (error) {
    console.error("Transaction failed:", error);
  }

  // --- FINAL BALANCES ---
  console.log("\n--- Final Balances ---");
  const usdc = await ethers.getContractAt("Token", USDC_ADDRESS);
  console.log(`User's EURE balance:      ${ethers.formatUnits(await eure.balanceOf(user.address), 18)}`);
  console.log(`User's USDC balance:      ${ethers.formatUnits(await usdc.balanceOf(user.address), 6)}`);
  console.log(`Tax wallet's EURE balance:  ${ethers.formatUnits(await eure.balanceOf(await splitPayment.taxWallet()), 18)}`);


  // --- CLEANUP ---
  console.log("\n--- Step 5: Cleanup ---");
  console.log("Removing EURE from valid stablecoins for a clean state...");
  await splitPayment.connect(owner).removeValidStablecoin(EURE_ADDRESS);
  console.log("EURE removed.");
  console.log("Script finished.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});