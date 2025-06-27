const hre = require("hardhat");

async function main() {
  // 1. Endereços e valor
  const senderAddress = "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955";
  const recipientAddress ="0x1e9d18eE6256306bB12c95aE502594567e2AE735"; 
  const amountToSend = hre.ethers.parseEther("1000"); // Enviando 10 POL (MATIC)

  // 2. Personificar a conta remetente
  console.log(`Personificando ${senderAddress}...`);
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [senderAddress],
  });
  const senderSigner = await hre.ethers.getSigner(senderAddress);

  // 3. Verificar saldos antes (opcional)
  const senderBalance = await hre.ethers.provider.getBalance(senderAddress);
  console.log(`Saldo do remetente ANTES: ${hre.ethers.formatEther(senderBalance)} POL`);
  const balanceBefore = await hre.ethers.provider.getBalance(recipientAddress);
  console.log(`Saldo do destinatário ANTES: ${hre.ethers.formatEther(balanceBefore)} POL`);

  // 4. Enviar a transação
  console.log(`Enviando ${hre.ethers.formatEther(amountToSend)} POL para ${recipientAddress}...`);
  const tx = await senderSigner.sendTransaction({
    to: recipientAddress,
    value: amountToSend,
  });
  await tx.wait();
  console.log("Transação concluída! Hash:", tx.hash);

  // 5. Verificar saldos depois (opcional)
  const balanceAfter = await hre.ethers.provider.getBalance(recipientAddress);
  console.log(`Saldo do destinatário DEPOIS: ${hre.ethers.formatEther(balanceAfter)} POL`);

  // 6. Parar de personificar a conta
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