import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './useWallet';

// Import ABIs
import TOKEN_ABI from '../constants/abi/Token.json';
import SPLIT_PAYMENT_ABI from '../constants/abi/SplitPayment.json';
// Import addresses from the JSON file
import contractAddresses from '../constants/contracts-addresses.json';

// Tipos para os argumentos da função de swap
interface SwapArgs {
  tokenInAddress: string;
  tokenOutAddress: string;
  amountIn: string;
  fee: number;
  tokenInDecimals: number;
}

interface SwapResult {
  txHash: string | null;
  error: string | null;
}

export function useSwap() {
  const { provider, account } = useWallet();
  const [isSwapping, setIsSwapping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const estimateGasForSwap = useCallback(async ({ tokenInAddress, amountIn, tokenInDecimals, tokenOutAddress, fee }: SwapArgs): Promise<string | null> => {
    if (!provider || !account || !amountIn || parseFloat(amountIn) <= 0) {
      return null;
    }

    try {
      // Usar o provider para estimativas, que são operações de leitura
      const tokenContract = new ethers.Contract(tokenInAddress, TOKEN_ABI.abi, provider);
      const splitPaymentContract = new ethers.Contract(contractAddresses.SplitPayment, SPLIT_PAYMENT_ABI.abi, provider);
      const amountToSwap = ethers.parseUnits(amountIn, tokenInDecimals);

      const currentAllowance = await tokenContract.allowance(account, contractAddresses.SplitPayment);

      let approveGas = 0n;
      let swapGas = 0n;


      if (currentAllowance < amountToSwap) {
        approveGas = await tokenContract.approve.estimateGas(contractAddresses.SplitPayment, amountToSwap, { from: account });
      }

      swapGas = await splitPaymentContract.splitAndSwapPayment.estimateGas(
        tokenInAddress,
        amountToSwap,
        tokenOutAddress,
        fee,
        { from: account } // Override para simular o 'msg.sender'
      );

      const totalGas = approveGas + swapGas;
      const feeData = await provider.getFeeData();
      
      const gasPrice = feeData.maxFeePerGas || feeData.gasPrice;

      if (!gasPrice) return null;

      const totalGasCost = totalGas * gasPrice;
      return ethers.formatEther(totalGasCost);

    } catch (err) {
      console.error("Erro ao estimar o gás:", err);
      // Fallback: Se a estimativa do swap falhar (raro com o override, mas possível),
      // pelo menos retorne o custo da aprovação.
      try {
        const tokenContract = new ethers.Contract(tokenInAddress, TOKEN_ABI.abi, provider);
        const amountToSwap = ethers.parseUnits(amountIn, tokenInDecimals);
        const approveGas = await tokenContract.approve.estimateGas(contractAddresses.SplitPayment, amountToSwap, { from: account });
        
        const feeData = await provider.getFeeData();
        const gasPrice = feeData.maxFeePerGas || feeData.gasPrice;
        if (!gasPrice) return null;

        const totalGasCost = approveGas * gasPrice;
        return ethers.formatEther(totalGasCost);
      } catch (approveErr) {
        console.error("Erro ao estimar o gás da aprovação (fallback):", approveErr);
        return null;
      }
    }
  }, [provider, account]);

  const executeSwap = useCallback(async ({ tokenInAddress, tokenOutAddress, amountIn, fee, tokenInDecimals }: SwapArgs): Promise<SwapResult> => {
    if (!provider || !account) {
      const errorMsg = "Carteira não conectada.";
      setError(errorMsg);
      return { txHash: null, error: errorMsg }; // Retorna um objeto de erro
    }
    setIsSwapping(true);
    setError(null);
    setTxHash(null);

    try {
      const signer = await provider.getSigner();
      const tokenContract = new ethers.Contract(tokenInAddress, TOKEN_ABI.abi, signer);
      const splitPaymentContract = new ethers.Contract(contractAddresses.SplitPayment, SPLIT_PAYMENT_ABI.abi, signer);
      const amountToSwap = ethers.parseUnits(amountIn, tokenInDecimals);
      const currentAllowance = await tokenContract.allowance(account, contractAddresses.SplitPayment);

      if (currentAllowance < amountToSwap) {
        const approveTx = await tokenContract.approve(contractAddresses.SplitPayment, amountToSwap);
        await approveTx.wait();
      }
      console.log("Aprovação concluída, iniciando o swap...");
      const swapTx = await splitPaymentContract.splitAndSwapPayment(
        tokenInAddress,
        amountToSwap,
        tokenOutAddress,
        fee
      );
      
      await swapTx.wait();
      setTxHash(swapTx.hash);
      
      return { txHash: swapTx.hash, error: null };

    } catch (err: any) {
      console.error("Erro durante o swap:", err);
      const errorMessage = err.reason || err.data?.message || err.message || "Ocorreu um erro desconhecido.";
      setError(errorMessage);
      return { txHash: null, error: errorMessage };
    } finally {
      setIsSwapping(false);
    }
  }, [provider, account]);

  return { executeSwap, isSwapping, error, txHash, estimateGasForSwap };
}