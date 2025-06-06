import { useContext, useEffect } from 'react';
import { AccountContext } from '../context/AccountContext';

interface EthereumProvider {
  request: (args: { method: string }) => Promise<any>;
  on: (event: string, handler: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export function useWallet() {
  const { account, setAccount } = useContext(AccountContext);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts[0] || '');
      });
    }
  }, []);

  const connect = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (err) {
        // Usuário recusou
      }
    } else {
      alert('MetaMask não encontrada!');
    }
  };

  const disconnect = () => {
    setAccount('');
  };

  return { account, connect, disconnect };
}
