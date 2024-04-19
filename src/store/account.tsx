import { createContext, useState } from "react";

type Props = {
  children: React.ReactNode;
};

export type AccountContextType = {
  activeAccount: string | null;
  accounts: Map<string, any>;

  changeActiveAccount: (address: string) => void;
  fetchAccount: (mnemonic: string) => Promise<string>;
  getNewMnemonic: () => string;
  subscribeToAccounts: () => Promise<void>;
};

export const AccountContext = createContext<AccountContextType | null>(null);

const AccountProvider: React.FC<Props> = ({ children }) => {
  const [activeAccount, setActiveAccount] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Map<string, any>>(new Map());

  function getNewMnemonic() {
    // TODO find real function in SEI
    return "qw er ty ui op as df gh jk zx cv bn";
  }

  function changeActiveAccount(address: string, updateCache = true) {
    setActiveAccount(address);
    // TODO: Once we get an info which library is safe to use, use it here
    // if (updateCache) {
    //   Keychain.setGenericPassword(
    //     address,
    //     JSON.stringify(mnemonics, jsonReplacer),
    //   );
    // }
  }

  async function fetchAccount(mnemo: string) {
    // TODO: Implement real fetching from SEI
    const fixedAddress = "5E7UzafXNhFLhuRNEekUd9xM7Sc1bffMfnGEyGGtsY3uW4cF";
    setAccounts(new Map(accounts.set(fixedAddress, {})));
    return fixedAddress;
  }

  async function subscribeToAccounts() {
    // TODO: Implement real subscription from SEI
  }

  return (
    <AccountContext.Provider
      value={{
        activeAccount,
        accounts,
        changeActiveAccount,
        fetchAccount,
        getNewMnemonic,
        subscribeToAccounts,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export default AccountProvider;
