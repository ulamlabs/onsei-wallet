import { useAccountsStore, useSettingsStore } from "@/store";
import {
  loadFromStorage,
  removeFromStorage,
  saveToStorage,
  unique,
} from "@/utils";
import {
  NFTTransaction,
  SerializedNftTxn,
  SerializedTx,
  Transaction,
} from "./types";
import {
  deserializeNftTxn,
  deserializeTxn,
  serializeNftTxn,
  serializeTxn,
} from "./utils";

const TXN_HISTORY_COUNT = 100;

export const getStoredTransactions = async (address: string) => {
  const key = getStorageKey(address);
  const txns = await loadFromStorage<SerializedTx[]>(key, []);
  return txns.map(deserializeTxn);
};

export const getStoredNftTransactions = async (address: string) => {
  const key = getStorageKey(address);
  const txns = await loadFromStorage<SerializedNftTxn[]>(key, []);
  return txns.map(deserializeNftTxn);
};

export const storeNewTransaction = async (
  address: string,
  transaction: Transaction,
) => {
  const savedTxns = await getStoredTransactions(address);
  await saveTransactionsToStorage(address, [transaction, ...savedTxns]);
};

export const storeNewNftTransaction = async (
  address: string,
  transaction: NFTTransaction,
) => {
  const savedTxns = await getStoredNftTransactions(address);
  await saveNftTransactionsToStorage(address, [transaction, ...savedTxns]);
};

export const combineTransactionsWithStorage = async (
  address: string,
  fetchedTransactions: Transaction[],
) => {
  const savedTxns = await getStoredTransactions(address);

  const txsToSave = unique(
    [...savedTxns, ...fetchedTransactions],
    (tx) => tx.hash,
  );

  if (savedTxns.length !== txsToSave.length) {
    await saveTransactionsToStorage(address, txsToSave);
  }

  return txsToSave;
};

const saveTransactionsToStorage = async (
  address: string,
  transactions: Transaction[],
) => {
  const key = getStorageKey(address);
  transactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  if (transactions.length > TXN_HISTORY_COUNT) {
    transactions.splice(TXN_HISTORY_COUNT);
  }

  await saveToStorage(key, transactions.map(serializeTxn));
};

const saveNftTransactionsToStorage = async (
  address: string,
  transactions: NFTTransaction[],
) => {
  const key = getStorageKey(address);
  transactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  if (transactions.length > TXN_HISTORY_COUNT) {
    transactions.splice(TXN_HISTORY_COUNT);
  }

  await saveToStorage(key, transactions.map(serializeNftTxn));
};

export const getAllKnownTransactionHashes = async (addresses: string[]) => {
  // A very inefficient way to do this but it's rarely executed so it's good enough.
  const txsPerAccount = await Promise.all(
    addresses.map((address) => getStoredTransactions(address)),
  );
  return new Set(txsPerAccount.flat().map((tx) => tx.hash));
};

const getStorageKey = (address: string) => {
  const node = useSettingsStore.getState().settings.node;
  return `transactions-${node}-${address}.json`;
};

export const clearTransactionsForAddress = async (address: string) => {
  const key = getStorageKey(address);
  await removeFromStorage(key);
};

export const clearAllTransactions = async () => {
  const addresses = useAccountsStore
    .getState()
    .accounts.map((acc) => acc.address);
  await Promise.all(addresses.map(clearTransactionsForAddress));
};
