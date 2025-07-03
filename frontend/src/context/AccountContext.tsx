import React, { createContext, useState, ReactNode } from 'react';
import { ethers } from 'ethers';

interface AccountContextType {
  account: string;
  setAccount: (account: string) => void;
  provider: ethers.BrowserProvider | null; // Adicione o provider aqui
  setProvider: (provider: ethers.BrowserProvider | null) => void; // E o setter dele
}

export const AccountContext = createContext<AccountContextType>({
  account: '',
  setAccount: () => {},
  provider: null,
  setProvider: () => {},
});

export const AccountProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null); // Estado do provider agora vive aqui

  return (
    <AccountContext.Provider value={{ account, setAccount, provider, setProvider }}>
      {children}
    </AccountContext.Provider>
  );
};
