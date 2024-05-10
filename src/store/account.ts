import { MNEMONIC_WORDS_COUNT, VALID_ACCOUNT_NAME_REGEX } from "@/const";
import {
  loadFromSecureStorage,
  loadFromStorage,
  removeFromSecureStorage,
  saveToSecureStorage,
  saveToStorage,
} from "@/utils";
import { generateWallet, restoreWallet } from "@sei-js/cosmjs";
import { create } from "zustand";
import { useTokensStore } from "./tokens";

export type Account = {
  name: string;
  address: string;
  passphraseSkipped: boolean;
};

export type Wallet = {
  address: string;
  mnemonic: string;
};

export type AccountsStore = {
  accounts: Account[];
  activeAccount: Account | null;
  init: () => Promise<void>;
  setActiveAccount: (address: string | null) => void;
  generateWallet: () => Promise<Wallet>;
  storeAccount: (
    name: string,
    wallet: Wallet,
    passphraseSkipped: boolean,
  ) => Promise<void>;
  importAccount: (name: string, mnemonic: string) => Promise<Account>;
  validateEntry: (name: string, address: string) => void;
  deleteAccount: (name: string) => Promise<void>;
  clearStore: () => Promise<void>;
  getMnemonic: (name: string) => string;
  editAccountName: (address: string, newName: string) => void;
  toggleAccountOption: (
    option: "hideAssetsValue" | "allowNotifications",
    address: string,
  ) => void;
};

export const useAccountsStore = create<AccountsStore>((set, get) => ({
  accounts: [],
  activeAccount: null,
  tokenPrice: 0,
  init: async () => {
    const accounts = await loadFromStorage<Account[]>("accounts", []);
    const activeAccount = accounts[0];
    if (activeAccount) {
      useTokensStore.getState().loadTokens(activeAccount.address);
    }
    set({ accounts, activeAccount });
  },
  setActiveAccount: (address) => {
    set((state) => ({
      ...state,
      activeAccount: state.accounts.find((a) => a.address === address),
    }));
    useTokensStore.getState().loadTokens(address ?? "");
  },
  generateWallet: async () => {
    const wallet = await generateWallet(MNEMONIC_WORDS_COUNT);
    const address = (await wallet.getAccounts())[0].address;
    return {
      address,
      mnemonic: wallet.mnemonic,
    };
  },
  storeAccount: async (name, wallet, passphraseSkipped = false) => {
    get().validateEntry(name, wallet.address);
    saveToSecureStorage(getMnenomicKey(wallet.address), wallet.mnemonic);

    const account: Account = {
      name,
      address: wallet.address,
      passphraseSkipped,
    };
    set((state) => {
      const accounts = [...state.accounts, account];
      saveToStorage("accounts", accounts);
      return { ...state, accounts };
    });
  },
  importAccount: async (name: string, mnemonic: string) => {
    const wallet = await restoreWallet(mnemonic);
    const address = (await wallet.getAccounts())[0].address;
    get().validateEntry(name, address);
    saveToSecureStorage(getMnenomicKey(address), wallet.mnemonic);

    const seiAccount = (await wallet.getAccounts())[0];
    const newAccount: Account = {
      name,
      address: seiAccount.address,
      passphraseSkipped: false,
    };

    set((state) => {
      const accounts = [...state.accounts, newAccount];
      saveToStorage("accounts", accounts);
      return { ...state, accounts };
    });

    return newAccount;
  },
  validateEntry: (name: string, address: string) => {
    const accounts = get().accounts;
    if (name.length > 20) {
      throw new Error("Name cannot be longer than 20 chars");
    }
    if (!VALID_ACCOUNT_NAME_REGEX.test(name)) {
      throw new Error(
        'Name cannot have any special characters except for "_" and "-"',
      );
    }
    if (accounts.find((a) => a.name === name)) {
      throw Error("An account with given name already exists");
    }
    if (accounts.find((a) => a.address === address)) {
      throw Error("An account with this address already exists");
    }
  },
  deleteAccount: async (address: string) => {
    removeFromSecureStorage(getMnenomicKey(address));
    await useTokensStore.getState().clearAddress(address);

    set((state) => {
      const accounts = state.accounts.filter((a) => a.address !== address);
      saveToStorage("accounts", accounts);
      return { ...state, accounts };
    });
  },
  clearStore: async () => {
    await Promise.all(
      get().accounts.map((account) => get().deleteAccount(account.address)),
    );
    get().setActiveAccount(null);
  },
  getMnemonic: (address: string) => {
    return loadFromSecureStorage(getMnenomicKey(address));
  },
  editAccountName(address, newName) {
    const { setActiveAccount, activeAccount } = get();
    set((state) => {
      const updatedAccounts = state.accounts.map((acc) => {
        if (acc.address === address) {
          return { ...acc, name: newName };
        }
        return acc;
      });
      saveToStorage("accounts", updatedAccounts);

      return { ...state, accounts: updatedAccounts };
    });
    if (activeAccount?.address === address) {
      setActiveAccount(address);
    }
  },
  toggleAccountOption(option, address) {
    const { activeAccount, setActiveAccount } = get();
    set((state) => {
      const updatedAccounts = state.accounts.map((acc) => {
        if (acc.address === address) {
          return { ...acc, [option]: !acc[option] };
        }
        return acc;
      });
      saveToStorage("accounts", updatedAccounts);

      return { ...state, accounts: updatedAccounts };
    });
    if (activeAccount?.address === address) {
      setActiveAccount(address);
    }
  },
}));

function getMnenomicKey(accountName: string) {
  return `account.${accountName}.mnemonic`;
}
