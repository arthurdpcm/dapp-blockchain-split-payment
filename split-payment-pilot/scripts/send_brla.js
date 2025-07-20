const hre = require("hardhat");

async function main() {
  // 1. Endereços e valor
  const senderAddress = "0xA9887267931953443F6C522412891Cbdcd0F77D8"; // Holder do token BRLA
  const recipientAddress = "0x1e9d18eE6256306bB12c95aE502594567e2AE735"; 
  const brlaTokenAddress = "0xe6a537a407488807f0bbeb0038b79004f19dddfb"; // Endereço do token BRLA
  const amountToSend = hre.ethers.parseUnits("1000", 18); // Enviando 1000 BRLA (assumindo 18 decimais)

  // 2. Personificar a conta remetente
  console.log(`Personificando ${senderAddress}...`);
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [senderAddress],
  });
  const senderSigner = await hre.ethers.getSigner(senderAddress);

  // 3. Obter instância do contrato do token BRLA
  const brlaToken = await hre.ethers.getContractAt("IERC20", brlaTokenAddress);

  // 4. Verificar saldos antes
  const senderBalance = await brlaToken.balanceOf(senderAddress);
  console.log(`Saldo BRLA do remetente ANTES: ${hre.ethers.formatUnits(senderBalance, 18)} BRLA`);
  const recipientBalanceBefore = await brlaToken.balanceOf(recipientAddress);
  console.log(`Saldo BRLA do destinatário ANTES: ${hre.ethers.formatUnits(recipientBalanceBefore, 18)} BRLA`);

  // 5. Enviar a transação
  console.log(`Enviando ${hre.ethers.formatUnits(amountToSend, 18)} BRLA para ${recipientAddress}...`);
  const tx = await brlaToken.connect(senderSigner).transfer(recipientAddress, amountToSend);
  await tx.wait();
  console.log("Transação concluída! Hash:", tx.hash);

  // 6. Verificar saldos depois
  const senderBalanceAfter = await brlaToken.balanceOf(senderAddress);
  console.log(`Saldo BRLA do remetente DEPOIS: ${hre.ethers.formatUnits(senderBalanceAfter, 18)} BRLA`);
  const recipientBalanceAfter = await brlaToken.balanceOf(recipientAddress);
  console.log(`Saldo BRLA do destinatário DEPOIS: ${hre.ethers.formatUnits(recipientBalanceAfter, 18)} BRLA`);

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