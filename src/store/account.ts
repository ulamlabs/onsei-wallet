import {
  MNEMONIC_WORDS_COUNT,
  NODE_URL,
  VALID_ACCOUNT_NAME_REGEX,
} from "@/const";
import {
  loadFromSecureStorage,
  loadFromStorage,
  removeFromSecureStorage,
  saveToSecureStorage,
  saveToStorage,
} from "@/utils";
import { generateWallet, getQueryClient, restoreWallet } from "@sei-js/cosmjs";
import { create } from "zustand";
import { useSettingsStore } from "./settings";
import { useTokensStore } from "./tokens";

export type Account = {
  name: string;
  address: string;
  balance: number;
  usdBalance: number;
  passphraseSkipped: boolean;
};

export type Wallet = {
  address: string;
  mnemonic: string;
};

export type AccountsStore = {
  accounts: Account[];
  activeAccount: Account | null;
  tokenPrice: number;
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
  subscribeToAccounts: () => void;
  getRawBalance: (address: string) => Promise<number>;
  getUSDBalance: (balance: number) => number;
  getBalance: (address: string) => Promise<number>;
  updateAccounts: (addresses?: string[]) => void;
};

export const useAccountsStore = create<AccountsStore>((set, get) => ({
  accounts: [],
  activeAccount: null,
  tokenPrice: 0,
  init: async () => {
    const accounts = await loadFromStorage<Account[]>("accounts", []);
    const balances = await Promise.all(
      accounts.map((acc) => get().getBalance(acc.address)),
    );

    const updatedAccounts = accounts.map((acc, index) => ({
      ...acc,
      balance: balances[index],
    }));
    const activeAccount = updatedAccounts[0];
    const node = useSettingsStore.getState().settings.node;
    useTokensStore.getState().loadTokens(activeAccount.address, node);
    set({ accounts: updatedAccounts, activeAccount });
  },
  setActiveAccount: (address) => {
    set((state) => ({
      ...state,
      activeAccount: state.accounts.find((a) => a.address === address),
    }));
    const node = useSettingsStore.getState().settings.node;
    useTokensStore.getState().loadTokens(address ?? "", node);
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
      balance: 0,
      usdBalance: 0,
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
    const balance = await get().getBalance(seiAccount.address);
    const newAccount: Account = {
      name,
      address: seiAccount.address,
      balance,
      usdBalance: get().getUSDBalance(balance),
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
  subscribeToAccounts: () => {
    // TODO: a function that observes balance changes on accounts and updates them
  },
  getRawBalance: async (address: string) => {
    try {
      if (!address) {
        return 0;
      }
      const queryClient = await getQueryClient(
        "https://rest." + NODE_URL[useSettingsStore.getState().settings.node],
      );
      const balance = await queryClient.cosmos.bank.v1beta1.allBalances({
        address,
      });
      const amount = +balance.balances[0]?.amount || 0;
      return amount;
    } catch (error) {
      console.error(error);
      return 0;
    }
  },
  getBalance: async (address) => {
    try {
      const rawBalance = await get().getRawBalance(address);

      return rawBalance / 10 ** 6;
    } catch (error) {
      console.error(error);
      return 0;
    }
  },
  getUSDBalance: (balance) => {
    // TODO: handle get token price
    return balance * get().tokenPrice;
  },
  updateAccounts: async (addresses) => {
    const { getBalance, accounts, setActiveAccount, activeAccount } = get();
    if (!addresses) {
      addresses = accounts.map((a) => a.address);
    }
    const udpatedAcc = await Promise.all(
      accounts.map(async (acc) => {
        if (addresses!.includes(acc.address)) {
          const bal = await getBalance(acc.address);
          return { ...acc, balance: bal };
        }
        return acc;
      }),
    );

    set((state) => {
      saveToStorage("accounts", udpatedAcc);
      return { ...state, accounts: udpatedAcc };
    });

    if (!activeAccount) {
      return;
    }

    setActiveAccount(
      udpatedAcc.find((acc) => acc.address === activeAccount?.address)
        ?.address || activeAccount.address,
    );
  },
}));

function getMnenomicKey(accountName: string) {
  return `account.${accountName}.mnemonic`;
}
