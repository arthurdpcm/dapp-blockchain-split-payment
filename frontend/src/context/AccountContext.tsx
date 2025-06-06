import { createContext, useState } from 'react';
import type { AccountContextType } from '../types/AccountContextType';

export const AccountContext = createContext<AccountContextType>({
  account: null,
  setAccount: (account: string) => {},
});

export const AccountProvider = ({ children }: { children: React.ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  return (
    <AccountContext.Provider value={{ account, setAccount }}>{children}</AccountContext.Provider>
  );
};
