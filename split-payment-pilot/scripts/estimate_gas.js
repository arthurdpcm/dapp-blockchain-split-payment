const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
const ethers = hre.ethers;

// Função auxiliar para formatar a saída
const printGasEstimation = (functionName, gasCost) => {
  console.log(`⛽ Estimativa de Gás para a função "${functionName}":`);
  console.log(`   - Custo em Gás: ${gasCost.toString()}`);
  console.log(`----------------------------------------------------`);
};

async function main() {
  console.log("Iniciando script de estimativa de gás...");
  console.log("----------------------------------------------------");

  // --- 1. Configuração ---
  const [owner] = await ethers.getSigners();
  const contractAddresses = JSON.parse(fs.readFileSync(path.join(__dirname, "../contract-addresses.json"), "utf8"));
  
  if (!contractAddresses.SplitPayment) {
    throw new Error("Endereço do contrato SplitPayment não encontrado. Faça o deploy primeiro.");
  }

  // Obter a instância do contrato já deployado
  const splitPayment = await ethers.getContractAt("SplitPayment", contractAddresses.SplitPayment, owner);
  console.log(`Conectado ao contrato SplitPayment em: ${splitPayment.target}`);
  console.log(`Usando a conta do owner: ${owner.address}`);
  console.log("----------------------------------------------------");

  // --- 2. Dados de Teste (Mock Data) ---
  // IMPORTANTE: Ajuste estes endereços para os tokens corretos da sua rede de teste (ex: Polygon Mumbai)
  const MOCK_STABLECOIN_BRL = "0xe6a537a407488807f0bbeb0038b79004f19dddfb"; // Exemplo: BRLA (fictício na testnet)
  const MOCK_STABLECOIN_USD = "0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582"; // Exemplo: USDC (fictício na testnet)
  const MOCK_TAX_WALLET = ethers.Wallet.createRandom().address;
  const MOCK_ROUTER = "0xE592427A0AEce92De3Edee1F18E0157C05861564"; // Router da Uniswap V3 na Polygon

  // --- 3. Estimativa de Gás para cada Função ---

  // setTaxWallet
  const gasSetTaxWallet = await splitPayment.setTaxWallet.estimateGas(MOCK_TAX_WALLET);
  printGasEstimation("setTaxWallet", gasSetTaxWallet);

  // setUniswapRouter
  const gasSetUniswapRouter = await splitPayment.setUniswapRouter.estimateGas(MOCK_ROUTER);
  printGasEstimation("setUniswapRouter", gasSetUniswapRouter);

  // setTaxPercentage
  const gasSetTaxPercentage = await splitPayment.setTaxPercentage.estimateGas(15); // 1.5%
  printGasEstimation("setTaxPercentage", gasSetTaxPercentage);

  // addValidStablecoin
  // Primeiro, garantimos que o token não existe para a estimativa funcionar
  if (await splitPayment.isValidStablecoin(MOCK_STABLECOIN_BRL)) {
    console.log("Token BRL já validado, pulando estimativa de 'addValidStablecoin'.");
  } else {
    const gasAddStablecoin = await splitPayment.addValidStablecoin.estimateGas(MOCK_STABLECOIN_BRL);
    printGasEstimation("addValidStablecoin", gasAddStablecoin);
  }

  // removeValidStablecoin
  // Primeiro, adicionamos um token temporário para poder estimar a remoção
  const tempToken = ethers.Wallet.createRandom().address;
  await splitPayment.addValidStablecoin(tempToken); // Executa a transação
  console.log(`Adicionado token temporário ${tempToken} para teste de remoção.`);
  const gasRemoveStablecoin = await splitPayment.removeValidStablecoin.estimateGas(tempToken);
  printGasEstimation("removeValidStablecoin", gasRemoveStablecoin);
  await splitPayment.removeValidStablecoin(tempToken); // Limpa o estado
  console.log(`Token temporário ${tempToken} removido.`);
  console.log("----------------------------------------------------");


  // splitAndSwapPayment (a mais complexa)
  console.log("Preparando estimativa para 'splitAndSwapPayment'...");
  const amountIn = ethers.parseUnits("10", 18); // 10 tokens (ajuste os decimais se necessário)
  const feeTier = 3000; // 0.3%

  // Para estimar o swap, o contrato precisa ter permissão (allowance)
  // e o token precisa ser um "stablecoin válido" no contrato.
  const tokenInContract = await ethers.getContractAt("IERC20", MOCK_STABLECOIN_BRL, owner);
  
  // Adiciona o token à lista de válidos (se ainda não estiver)
  if (!await splitPayment.isValidStablecoin(MOCK_STABLECOIN_BRL)) {
    await splitPayment.addValidStablecoin(MOCK_STABLECOIN_BRL);
    console.log(`Token ${MOCK_STABLECOIN_BRL} adicionado à lista de válidos para o teste.`);
  }

  // Aprova o contrato a gastar os tokens
  console.log(`Aprovando o contrato SplitPayment a gastar ${ethers.formatUnits(amountIn, 18)} tokens...`);
  const approveTx = await tokenInContract.approve(splitPayment.target, amountIn);
  await approveTx.wait(); // Espera a aprovação ser minerada
  console.log("Aprovação concluída.");

  const gasSplitAndSwap = await splitPayment.splitAndSwapPayment.estimateGas(
    MOCK_STABLECOIN_BRL,
    amountIn,
    MOCK_STABLECOIN_USD,
    feeTier
  );
  printGasEstimation("splitAndSwapPayment", gasSplitAndSwap);

  console.log("✅ Script de estimativa de gás concluído com sucesso!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});