import { MNEMONIC_WORDS_COUNT } from "@/const";
import { getPrivateKeyFromMnemonic, isAddressLinked } from "@/services/evm";
import {
  loadFromSecureStorage,
  loadFromStorage,
  removeFromSecureStorage,
  removeFromStorage,
  saveToSecureStorage,
  saveToStorage,
} from "@/utils";
import { validateEntry } from "@/utils/validateInputs";
import { generateWallet, restoreWallet } from "@sei-js/cosmjs";
import { privateKeyToAccount } from "viem/accounts";
import { create } from "zustand";
import { useTokensStore } from "./tokens";

export type AccountOptions = {
  passphraseSkipped: boolean;
  addressLinked: boolean;
};

export type Account = {
  name: string;
  address: string;
  evmAddress: `0x${string}`;
} & AccountOptions;

export type Wallet = {
  address: string;
  evmAddress: `0x${string}`;
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
    options: AccountOptions,
  ) => Promise<void>;
  confirmMnemonic: (address: string) => void;
  deleteAccount: (name: string) => Promise<void>;
  clearStore: () => Promise<void>;
  getMnemonic: (address: string) => string;
  restoreWallet: (mnemonic: string) => Promise<Wallet>;
  editAccountName: (address: string, newName: string) => void;
  getEvmAddress: (mnemonic: string) => Promise<`0x${string}`>;
  setLinkForAddress: (address: string) => void;
};

export const useAccountsStore = create<AccountsStore>((set, get) => ({
  accounts: [],
  activeAccount: null,
  tokenPrice: 0,
  init: async () => {
    const accounts = await loadFromStorage<Account[]>("accounts", []);
    const activeAccountAddress = await loadFromStorage<string | null>(
      "activeAccount",
      accounts[0]?.address,
    );
    const activeAccount = activeAccountAddress
      ? accounts.find((acc) => acc.address === activeAccountAddress)!
      : null;
    if (activeAccount) {
      useTokensStore
        .getState()
        .loadTokens(activeAccount.address, activeAccount.evmAddress);
    }

    let wasLinkChange = false;
    await Promise.all(
      accounts.map(async (acc) => {
        if (!acc.addressLinked) {
          // Check if user already linked address outside of wallet
          const isLinked = await isAddressLinked(acc.address);
          if (isLinked) {
            acc.addressLinked = true;
            wasLinkChange = true;
          }
        }
      }),
    );

    if (wasLinkChange) {
      await saveToStorage("accounts", accounts);
    }

    set({ accounts, activeAccount });
  },
  setActiveAccount: (address) => {
    if (!address) {
      removeFromStorage("activeAccount");
      return;
    }

    const account = get().accounts.find((a) => a.address === address);
    set((state) => ({
      ...state,
      activeAccount: account,
    }));
    saveToStorage("activeAccount", account?.address);
    useTokensStore.getState().loadTokens(address ?? "", account?.evmAddress);
  },
  generateWallet: async () => {
    const wallet = await generateWallet(MNEMONIC_WORDS_COUNT);
    const address = (await wallet.getAccounts())[0].address;
    const evmAddress = await get().getEvmAddress(wallet.mnemonic);
    return {
      address,
      evmAddress,
      mnemonic: wallet.mnemonic,
    };
  },
  restoreWallet: async (mnemonic) => {
    const wallet = await restoreWallet(mnemonic);
    const address = (await wallet.getAccounts())[0].address;
    const evmAddress = await get().getEvmAddress(mnemonic);
    return {
      address,
      evmAddress,
      mnemonic: wallet.mnemonic,
    };
  },
  storeAccount: async (
    name,
    wallet,
    options = { addressLinked: false, passphraseSkipped: false },
  ) => {
    const accounts = get().accounts;
    validateEntry(name, wallet.address, accounts);
    saveToSecureStorage(getMnenomicKey(wallet.address), wallet.mnemonic);

    const account: Account = {
      name,
      address: wallet.address,
      evmAddress: wallet.evmAddress,
      passphraseSkipped: options.passphraseSkipped,
      addressLinked: options.addressLinked,
    };
    set((state) => {
      const accounts = [...state.accounts, account];
      saveToStorage("accounts", accounts);
      return { ...state, accounts };
    });
  },
  confirmMnemonic: (address) => {
    const accounts = get().accounts;
    const account = accounts.find((a) => a.address === address)!;
    account.passphraseSkipped = false;
    set((state) => {
      saveToStorage("accounts", accounts);
      return { ...state, accounts };
    });
  },
  deleteAccount: async (address) => {
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
  getMnemonic: (address) => {
    return loadFromSecureStorage(getMnenomicKey(address));
  },
  editAccountName: (address, newName) => {
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
  getEvmAddress: async (mnemonic) => {
    const privKey = await getPrivateKeyFromMnemonic(mnemonic);
    const evmAccount = privateKeyToAccount(privKey);
    return evmAccount.address;
  },
  setLinkForAddress: async (address) => {
    set((state) => {
      const updatedAccounts = state.accounts.map((acc) => {
        if (acc.address === address) {
          return { ...acc, addressLinked: true };
        }
        return acc;
      });
      const updatedActive = state.activeAccount;
      if (updatedActive?.address === address) {
        updatedActive.addressLinked = true;
      }
      saveToStorage("accounts", updatedAccounts);
      return {
        ...state,
        accounts: updatedAccounts,
        activeAccount: updatedActive,
      };
    });
  },
}));

function getMnenomicKey(accountName: string) {
  return `account.${accountName}.mnemonic`;
}
