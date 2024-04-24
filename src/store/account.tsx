import {
  loadFromSecureStorage,
  loadFromStorage,
  MNEMONIC_WORDS_COUNT,
  removeFromSecureStorage,
  saveToSecureStorage,
  saveToStorage,
} from "@/utils";
import { generateWallet, restoreWallet } from "@sei-js/cosmjs";
import { create } from "zustand";

const NODE_KEY = "NETWORK";
const nodes: Record<Node, string> = {
  MainNet: "https://rpc.wallet.pacific-1.sei.io",
  TestNet: "https://rpc.wallet.atlantic-2.sei.io",
};

export type Node = "MainNet" | "TestNet";

export type Account = {
  name: string;
  address: string;
};

export type Wallet = {
  address: string;
  mnemonic: string;
};

type AccountsStore = {
  accounts: Account[];
  activeAccount: Account | null;
  tokenPrice: number;
  node: Node;
  init: () => Promise<void>;
  setActiveAccount: (address: string | null) => void;
  generateWallet: () => Promise<Wallet>;
  storeAccount: (name: string, wallet: Wallet) => Promise<void>;
  importAccount: (name: string, mnemonic: string) => Promise<Account>;
  checkDuplicate: (name: string, address: string) => void;
  deleteAccount: (name: string) => Promise<void>;
  clearStore: () => void;
  getMnemonic: (name: string) => string;
  subscribeToAccounts: () => void;
  getRawBalance: (address?: string) => number;
  getBalance: (address?: string) => number;
  getUSDBalance: (address?: string) => number;
};

export const useAccountsStore = create<AccountsStore>((set, get) => ({
  accounts: [],
  activeAccount: null,
  tokenPrice: 0,
  node: "MainNet",
  init: async () => {
    const accounts = await loadFromStorage("accounts", []);
    set({ accounts, activeAccount: accounts[0] });
  },
  setActiveAccount: (address: string | null) => {
    set((state) => ({
      ...state,
      activeAccount: state.accounts.find((a) => a.address === address),
    }));
  },
  generateWallet: async () => {
    const wallet = await generateWallet(MNEMONIC_WORDS_COUNT);
    const address = (await wallet.getAccounts())[0].address;
    return {
      address,
      mnemonic: wallet.mnemonic,
    };
  },
  storeAccount: async (name: string, wallet: Wallet) => {
    useAccountsStore.getState().checkDuplicate(name, wallet.address);
    saveToSecureStorage(getMnenomicKey(wallet.address), wallet.mnemonic);

    const account: Account = {
      name,
      address: wallet.address,
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
    useAccountsStore.getState().checkDuplicate(name, address);
    saveToSecureStorage(getMnenomicKey(address), wallet.mnemonic);

    const seiAccount = (await wallet.getAccounts())[0];
    const newAccount: Account = {
      name,
      address: seiAccount.address,
    };

    set((state) => {
      const accounts = [...state.accounts, newAccount];
      saveToStorage("accounts", accounts);
      return { ...state, accounts };
    });

    return newAccount;
  },
  checkDuplicate: (name: string, address: string) => {
    const accounts = useAccountsStore.getState().accounts;
    if (accounts.find((a) => a.name === name)) {
      throw Error("An account with given name already exists");
    }
    if (accounts.find((a) => a.address === address)) {
      throw Error("An account with this address already exists");
    }
  },
  deleteAccount: async (address: string) => {
    removeFromSecureStorage(getMnenomicKey(address));

    set((state) => {
      const accounts = state.accounts.filter((a) => a.address !== address);
      saveToStorage("accounts", accounts);
      return { ...state, accounts };
    });
  },
  clearStore: () => {
    for (const account of useAccountsStore.getState().accounts) {
      useAccountsStore.getState().deleteAccount(account.address);
    }
    useAccountsStore.getState().setActiveAccount(null);
  },
  getMnemonic: (address: string) => {
    return loadFromSecureStorage(getMnenomicKey(address));
  },
  subscribeToAccounts: () => {
    // TODO: a function that observes balance changes on accounts and updates them
  },
  getRawBalance: (address: string = get().activeAccount!.address) => {
    if (!address || false) return 0.0;
    // TODO: handle fetching acount balance
    return 0.0;
  },
  getBalance: (address: string = get().activeAccount!.address) => {
    if (!address) return 0;
    return get().getRawBalance(address) / 10;
  },
  getUSDBalance: (address: string = get().activeAccount!.address) => {
    return get().getBalance(address) * get().tokenPrice;
  },
}));

function getMnenomicKey(accountName: string) {
  return `account.${accountName}.mnemonic`;
}
