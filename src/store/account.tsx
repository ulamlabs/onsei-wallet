import { MNEMONIC_WORDS_COUNT } from "@/const";
import {
  loadFromSecureStorage,
  loadFromStorage,
  removeFromSecureStorage,
  saveToSecureStorage,
  saveToStorage,
} from "@/utils";
import { generateWallet, getQueryClient, restoreWallet } from "@sei-js/cosmjs";
import { create } from "zustand";

const NODE_KEY = "NETWORK";
const nodes: Record<Node, string> = {
  MainNet: "https://rest.sei-apis.com",
  TestNet: "https://rest.atlantic-2.seinetwork.io",
};

export type Node = "MainNet" | "TestNet";

export type Account = {
  name: string;
  address: string;
  balance: number;
  usdBalance: number;
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
  getRawBalance: (address: string) => Promise<number>;
  getUSDBalance: (balance: number) => number;
};

export const useAccountsStore = create<AccountsStore>((set, get) => ({
  accounts: [],
  activeAccount: null,
  tokenPrice: 0,
  node: "TestNet",
  init: async () => {
    const accounts = await loadFromStorage<Account[]>("accounts", []);
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
      balance: 0,
      usdBalance: 0,
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
    const balance = await get().getRawBalance(seiAccount.address);
    const newAccount: Account = {
      name,
      address: seiAccount.address,
      balance,
      usdBalance: get().getUSDBalance(balance),
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
  getRawBalance: async (address: string) => {
    try {
      if (!address) {
        return 0;
      }
      const queryClient = await getQueryClient(nodes[get().node]);
      const balance = await queryClient.cosmos.bank.v1beta1.allBalances({
        address,
      });
      const amount = +balance.balances[0]?.amount || 0;
      return amount;
    } catch (error) {
      console.log(error);
      return 0;
    }
  },
  getUSDBalance: (balance) => {
    // TODO: handle get token price
    return balance * get().tokenPrice;
  },
}));

function getMnenomicKey(accountName: string) {
  return `account.${accountName}.mnemonic`;
}
