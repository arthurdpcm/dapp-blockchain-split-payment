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

      // Aprovação
      const approveTx = await tokenContract.approve(contractAddresses.SplitPayment, amountToSwap);
      await approveTx.wait();

      const swapTx = await splitPaymentContract.splitAndSwapPayment(
        tokenInAddress,
        amountToSwap,
        tokenOutAddress,
        fee
      );
      console.log("Transação de swap enviada:", swapTx.hash);
      
      await swapTx.wait();
      setTxHash(swapTx.hash);

      console.log("Swap concluído com sucesso!");
      
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

  return { executeSwap, isSwapping, error, txHash};
}