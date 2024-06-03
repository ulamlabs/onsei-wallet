import { useSettingsStore } from "@/store";
import { loadFromStorage, saveToStorage } from "@/utils";
import { SerializedTx, Transaction } from "./types";
import { deserializeTxn, serializeTxn } from "./utils";

const TXN_HISTORY_COUNT = 100;

export const getStoredTransactions = async (address: string) => {
  const key = getStorageKey(address);
  const txns = await loadFromStorage<SerializedTx[]>(key, []);
  return txns.map(deserializeTxn);
};

export const storeNewTransaction = async (
  address: string,
  transaction: Transaction,
) => {
  const savedTxns = await getStoredTransactions(address);
  await saveTransactionsToStorage(address, [transaction, ...savedTxns]);
};

export const combineTransactionsWithStorage = async (
  address: string,
  fetchedTransactions: Transaction[],
) => {
  const savedTxns = await getStoredTransactions(address);
  const knownHashes = new Set(savedTxns.map((t) => t.hash));

  for (const txn of fetchedTransactions) {
    if (!knownHashes.has(txn.hash)) {
      savedTxns.push(txn);
    }
  }

  if (savedTxns.length !== knownHashes.size) {
    await saveTransactionsToStorage(address, savedTxns);
  }

  return savedTxns;
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

const getStorageKey = (address: string) => {
  const node = useSettingsStore.getState().settings.node;
  return `transactions-${node}-${address}.json`;
};
