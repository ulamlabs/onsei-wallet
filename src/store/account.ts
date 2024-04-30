import {
  MNEMONIC_WORDS_COUNT,
  NODE_URL,
  VALID_ACCOUNT_NAME_REGEX,
} from "@/const";
import {
  fetchData,
  loadFromSecureStorage,
  loadFromStorage,
  removeFromSecureStorage,
  saveToSecureStorage,
  saveToStorage,
} from "@/utils";
import {
  Coin,
  generateWallet,
  getQueryClient,
  restoreWallet,
} from "@sei-js/cosmjs";
import { create } from "zustand";
import { useSettingsStore } from "./settings";

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

type ResponseAmount = {
  address: string;
  coins: Coin[];
};

type TxResponse = {
  txhash: string;
  tx: {
    body: {
      messages: {
        type: string;
        inputs: ResponseAmount[];
        outputs: ResponseAmount[];
      }[];
    };
  };
  timestamp: string;
};

type Pagination = {
  next_key: string;
  total: string;
};

type TransactionData = {
  tx_responses: TxResponse[];
  pagination: Pagination;
};

type AccountsStore = {
  accounts: Account[];
  activeAccount: Account | null;
  tokenPrice: number;
  init: () => Promise<void>;
  setActiveAccount: (address: string | null) => void;
  generateWallet: () => Promise<Wallet>;
  storeAccount: (name: string, wallet: Wallet) => Promise<void>;
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
    set({ accounts: updatedAccounts, activeAccount: updatedAccounts[0] });
  },
  setActiveAccount: (address) => {
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
    get().validateEntry(name, wallet.address);
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
    get().validateEntry(name, address);
    saveToSecureStorage(getMnenomicKey(address), wallet.mnemonic);

    const seiAccount = (await wallet.getAccounts())[0];
    const balance = await get().getBalance(seiAccount.address);
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
    if (!addresses) addresses = accounts.map((a) => a.address);
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
  fetchTxns: async () => {
    try {
      const { node } = get();
      const send = `${nodes[node]}/cosmos/tx/v1beta1/txs?pagination.limit=10&pagination.reverse=true&events=transfer.sender='sei16hh9vgk2w9stn6vemapuzqw3qk8wc70q8y9wf9'`;
      const received = `${nodes[node]}/cosmos/tx/v1beta1/txs?pagination.limit=10&pagination.reverse=true&events=transfer.recipient='sei16hh9vgk2w9stn6vemapuzqw3qk8wc70q8y9wf9'`;

      const sendData: TransactionData = await fetchData(send);
      const receivedData: TransactionData = await fetchData(received);
      console.log(sendData.pagination.next_key);
      console.log("Send data:", sendData);
      console.log("Received data:", receivedData);
    } catch (error) {
      throw Error(error as any);
    }
  },
}));

function getMnenomicKey(accountName: string) {
  return `account.${accountName}.mnemonic`;
}
