const hre = require("hardhat");
const { ethers } = hre;
const { setBalance } = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
  // --- CONFIGURATION ---
  const addresses = require("../contract-addresses.json");
  const BRL_STABLECOINS = [
    { symbol: 'USDC',
      name: 'USD Coin',
      address: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
      image: '/usdc_logo.png',
      decimals: 6
    },
  ];

  // --- INITIALIZATION ---
  console.log("Initializing onlyOwner test script...");

  // O endereço que queremos usar para o teste
  const notOwnerAddress = "0x1e9d18eE6256306bB12c95aE502594567e2AE735";

  // 1. Personificar a conta do "não-proprietário"
  await hre.network.provider.send("hardhat_impersonateAccount", [notOwnerAddress]);
  
  // 2. Dar saldo à conta para que ela possa pagar o gás da transação
  await setBalance(notOwnerAddress, ethers.parseEther("10.0")); // Dando 10 MATIC

  // 3. Obter o Signer da conta personificada
  const notOwner = await ethers.getSigner(notOwnerAddress);
  
  // Obter o contrato
  const splitPayment = await ethers.getContractAt("SplitPayment", addresses.SplitPayment);
  const contractOwnerAddress = await splitPayment.owner();

  console.log(`Contract owner is: ${contractOwnerAddress}`);
  console.log(`Attempting call from (notOwner): ${notOwner.address}`);

  try {
    console.log(`\nAttempting to call addValidStablecoin as notOwner...`);
    // 4. Conectar o Signer do "não-proprietário" para chamar a função
    await splitPayment.connect(notOwner).addValidStablecoin(BRL_STABLECOINS[0].address);

    // Se a linha acima NÃO falhar, o teste falhou.
    console.error("❌ Test Failed: The transaction should have been reverted but was not.");
    process.exitCode = 1;

  } catch (error) {
    const expectedErrorMessage = "Only the owner can call this function.";

    // Verificamos se a mensagem de erro é a que esperamos do OpenZeppelin Ownable.
    if (error.message.includes(expectedErrorMessage)) {
      console.log("✅ Test Passed: Transaction reverted with the correct error message.");
      console.log(`   Error reason: "${expectedErrorMessage}"`);
    } else {
      console.error("❌ Test Failed: Transaction reverted with an UNEXPECTED error message.");
      console.error("   Received error:", error.message);
      process.exitCode = 1;
    }
  } finally {
    // Opcional, mas boa prática: parar de personificar a conta
    await hre.network.provider.send("hardhat_stopImpersonatingAccount", [notOwnerAddress]);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
