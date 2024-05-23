import { useSettingsStore } from "@/store";
import { loadFromStorage, saveToStorage } from "@/utils";
import { Transaction } from "./types";

const TXN_HISTORY_COUNT = 100;

export const getStoredTransactions = async (address: string) => {
  const key = getStorageKey(address);
  const txns = await loadFromStorage<Transaction[]>(key, []);
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
  transactions.sort(
    (a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf(),
  );
  if (transactions.length > TXN_HISTORY_COUNT) {
    transactions.splice(TXN_HISTORY_COUNT);
  }

  await saveToStorage(key, transactions.map(serializeTxn));
};

const getStorageKey = (address: string) => {
  const node = useSettingsStore.getState().settings.node;
  return `transactions-${node}-${address}.json`;
};

const serializeTxn = (txn: Transaction) => {
  return { ...txn, amount: txn.amount.toString(), fee: txn.fee.toString() };
};

const deserializeTxn = (txn: Transaction) => {
  return { ...txn, amount: BigInt(txn.amount), fee: BigInt(txn.fee || 0) };
};
