import { useEffect, useState } from 'react';
import { ethers, BrowserProvider, Contract } from 'ethers';
import { useWallet } from './useWallet';
import { ZERO_ADDRESS } from '@/constants/stablecoins';

const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

export function useTokenBalance(tokenAddress?: string) {
  const { account } = useWallet();
  const [balance, setBalance] = useState<string>('0');

  useEffect(() => {
    if (!account) {
      setBalance('0');
      return;
    }

    const fetchBalance = async () => {
      try {
        if (!window.ethereum) {
          console.error('MetaMask is not available');
          return;
        }
        const provider = new BrowserProvider(window.ethereum);

        if (!tokenAddress || tokenAddress === ZERO_ADDRESS) {
          // ETH native balance
          const rawBalance = await provider.getBalance(account);
          setBalance(ethers.formatEther(rawBalance));
        } else {
          // ERC-20 token balance
          if (!ethers.isAddress(tokenAddress)) {
            console.warn('Invalid token address provided:', tokenAddress);
            setBalance('0');
            return;
          }

          const contract = new Contract(tokenAddress, ERC20_ABI, provider);
          const rawBalance = await contract.balanceOf(account);
          const decimals = await contract.decimals();
          setBalance(ethers.formatUnits(rawBalance, decimals));
        }
      } catch (error) {
        console.error('Error fetching token balance:', error);
        setBalance('0');
      }
    };

    fetchBalance();
  }, [account, tokenAddress]);
  return balance;
}
