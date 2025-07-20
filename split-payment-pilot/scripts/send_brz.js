const hre = require("hardhat");

async function main() {
  // 1. Endereços e valor
  const senderAddress = "0x811581cCed8fBc6b8ef1E7e1A7502AFda0fCe2F8"; // Holder do token BRZ
  const recipientAddress = "0x1e9d18eE6256306bB12c95aE502594567e2AE735"; 
  const brzTokenAddress = "0x4ed141110f6eeeaba9a1df36d8c26f684d2475dc"; // Endereço do token BRZ
  const amountToSend = hre.ethers.parseUnits("1000", 18); // Enviando 1000 BRZ (assumindo 18 decimais)

  // 2. Personificar a conta remetente
  console.log(`Personificando ${senderAddress}...`);
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [senderAddress],
  });
  const senderSigner = await hre.ethers.getSigner(senderAddress);

  // 3. Obter instância do contrato do token BRZ
  const brzToken = await hre.ethers.getContractAt("IERC20", brzTokenAddress);

  // 4. Verificar saldos antes
  const senderBalance = await brzToken.balanceOf(senderAddress);
  console.log(`Saldo BRZ do remetente ANTES: ${hre.ethers.formatUnits(senderBalance, 18)} BRZ`);
  const recipientBalanceBefore = await brzToken.balanceOf(recipientAddress);
  console.log(`Saldo BRZ do destinatário ANTES: ${hre.ethers.formatUnits(recipientBalanceBefore, 18)} BRZ`);

  // 5. Enviar a transação
  console.log(`Enviando ${hre.ethers.formatUnits(amountToSend, 18)} BRZ para ${recipientAddress}...`);
  const tx = await brzToken.connect(senderSigner).transfer(recipientAddress, amountToSend);
  await tx.wait();
  console.log("Transação concluída! Hash:", tx.hash);

  // 6. Verificar saldos depois
  const senderBalanceAfter = await brzToken.balanceOf(senderAddress);
  console.log(`Saldo BRZ do remetente DEPOIS: ${hre.ethers.formatUnits(senderBalanceAfter, 18)} BRZ`);
  const recipientBalanceAfter = await brzToken.balanceOf(recipientAddress);
  console.log(`Saldo BRZ do destinatário DEPOIS: ${hre.ethers.formatUnits(recipientBalanceAfter, 18)} BRZ`);

  // 7. Parar de personificar a conta
  await hre.network.provider.request({
    method: "hardhat_stopImpersonatingAccount",
    params: [senderAddress],
  });
  console.log("Personificação encerrada.");
}

// Padrão recomendado para usar async/await em todos os lugares
// e tratar erros corretamente.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 