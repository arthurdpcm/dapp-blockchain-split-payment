import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './useWallet';
import ERC20_ABI from '../constants/abi/Token.json';
import { STABLECOINS } from '@/constants/stablecoins';

export function useTokenBalance(tokenAddress: string) {
  const { account, provider } = useWallet();
  const [balance, setBalance] = useState('0');
  // Adicionamos um contador para forçar a atualização
  const [refreshCount, setRefreshCount] = useState(0);
  const getTokenDecimals = useCallback((tokenAddress: string): number => {
    const token = STABLECOINS.find(
      (coin) => coin.address.toLowerCase() === tokenAddress.toLowerCase()
    );
    return token ? token.decimals : 6; // Default para 6 decimais
  }, []);
  const fetchBalance = useCallback(async () => {
    if (account && provider && tokenAddress && ethers.isAddress(tokenAddress)) {
      try {
        const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI.abi, provider);
        const balanceBigInt = await tokenContract.balanceOf(account);
        const decimals = getTokenDecimals(tokenAddress);
        setBalance(ethers.formatUnits(balanceBigInt, decimals));
      } catch (error) {
        console.error(`Erro ao buscar saldo para o token ${tokenAddress}:`, error);
        setBalance('0');
      }
    } else {
      setBalance('0');
    }
  }, [account, provider, tokenAddress]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance, refreshCount]); // O useEffect agora também depende do refreshCount

  // Função que os componentes podem chamar para forçar uma atualização
  const refreshBalance = () => {
    setRefreshCount((count) => count + 1);
  };

  // Retornamos o saldo e a função de atualização
  return { balance, refreshBalance };
}
