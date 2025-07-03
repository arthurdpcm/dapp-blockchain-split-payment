import { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';
import { ethers } from 'ethers';

interface AccountContextType {
  account: string;
  setAccount: (account: string) => void;
  provider: ethers.BrowserProvider | null;
  setProvider: (provider: ethers.BrowserProvider | null) => void;
}

// O contexto não é mais exportado. Ele fica privado para este arquivo.
const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  return (
    <AccountContext.Provider value={{ account, setAccount, provider, setProvider }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
};
