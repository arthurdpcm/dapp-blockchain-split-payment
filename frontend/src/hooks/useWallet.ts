import { useContext, useEffect } from 'react';
import { AccountContext } from '../context/AccountContext';
import { ethers } from 'ethers';

interface EthereumProvider {
  request: (args: { method: string }) => Promise<any>;
  on: (event: string, handler: (...args: any[]) => void) => void;
  removeListener: (event: string, handler: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export function useWallet() {
  // Agora pegamos TUDO do contexto
  const { account, setAccount, provider, setProvider } = useContext(AccountContext);

  // O useEffect não precisa mais do provider como dependência
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          // Se o provider não existir, crie um novo
          if (!provider) {
            setProvider(new ethers.BrowserProvider(window.ethereum!));
          }
        } else {
          setAccount('');
          setProvider(null); // Limpa o provider global
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      // Função de limpeza para remover o listener
      return () => {
        window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, [setAccount, setProvider, provider]); // Adicione setProvider e provider aqui

  const connect = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        // Cria e define o provider GLOBAL
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(newProvider);
      } catch (err) {
        console.error("Erro ao conectar:", err);
      }
    } else {
      alert('MetaMask não encontrada!');
    }
  };

  const disconnect = () => {
    setAccount('');
    setProvider(null); // Limpa o provider global
  };

  // Retorna os valores globais do contexto
  return { provider, account, connect, disconnect };
}