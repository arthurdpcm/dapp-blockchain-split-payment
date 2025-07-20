import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import contractAddresses from "../../frontend/src/constants/contracts-addresses.json";

task("add-stablecoin", "Adiciona um novo endereço de stablecoin à lista de tokens válidos no contrato SplitPayment")
  .addPositionalParam("tokenaddress", "O endereço da stablecoin a ser adicionada")
  .setAction(async (taskArgs: { tokenaddress: string }, hre: HardhatRuntimeEnvironment) => {
    const { ethers } = hre;
    const tokenAddress = taskArgs.tokenaddress;

    if (!ethers.isAddress(tokenAddress)) {
      console.error(`Erro: Endereço inválido fornecido: ${tokenAddress}`);
      return;
    }

    console.log(`Adicionando stablecoin ${tokenAddress} ao contrato SplitPayment...`);

    // Pega a conta do deployer para assinar a transação (deve ser o dono do contrato)
    const [owner] = await ethers.getSigners();
    console.log(`Usando a conta do dono: ${owner.address}`);

    // Pega a instância do contrato SplitPayment
    const splitPaymentContract = await ethers.getContractAt(
      "SplitPayment", 
      contractAddresses.SplitPayment,
      owner
    );

    try {
      console.log("Enviando transação para adicionar o token...");
      const tx = await splitPaymentContract.addValidStablecoin(tokenAddress);

      console.log(`Transação enviada! Hash: ${tx.hash}`);
      console.log("Aguardando a mineração da transação...");

      await tx.wait();

      console.log(`\n✅ Sucesso! A stablecoin ${tokenAddress} foi adicionada ao contrato.`);

      const isValid = await splitPaymentContract.isValidStablecoin(tokenAddress);
      if (isValid) {
        console.log(`Verificação bem-sucedida: ${tokenAddress} agora é um token válido.`);
      } else {
        console.warn(`A verificação falhou. Por favor, verifique o estado do contrato manualmente.`);
      }

    } catch (error: any) {
      console.error("\n❌ Ocorreu um erro:");
      // Mostra a razão do erro vinda do contrato, se disponível
      console.error(error.reason || error.message);
    }
  });

export default {}; 