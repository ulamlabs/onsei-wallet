import { Transaction, getTransactions } from "@/modules/transactions";
import { useAccountsStore, useSettingsStore } from "@/store";
import { saveToStorage, loadFromStorage, unique } from "@/utils";
import { notifyTx } from "./pushNotifications";

export async function poolAndNotifyNewTxs(): Promise<boolean> {
  const addresses = useAccountsStore.getState().accounts.map((a) => a.address);

  const txs = await poolNewTxs(addresses);

  let notified = false;
  const addressesSet = new Set(addresses);
  for (const tx of txs) {
    notified ||= await notifyTx(tx, addressesSet);
  }
  return notified;
}

async function poolNewTxs(addresses: string[]): Promise<Transaction[]> {
  const address = useAccountsStore.getState().activeAccount?.address;
  if (!address) {
    return [];
  }

  const timestampKey = getTimestampKey(address);

  const sLastTimestamp = await loadFromStorage(timestampKey, "");
  if (!sLastTimestamp) {
    saveToStorage(timestampKey, new Date().toISOString());
    return [];
  }

  const lastTimestamp = new Date(sLastTimestamp);
  const newTxsPerAccount = await Promise.all(
    addresses.map((address) => fetchAccountTxs(address, lastTimestamp)),
  );
  const newTxs = unique(newTxsPerAccount.flat(), (tx) => tx.hash);

  saveToStorage(timestampKey, new Date());

  return newTxs;
}

async function fetchAccountTxs(
  address: string,
  lastTimestamp: Date,
): Promise<Transaction[]> {
  const tx = (await getTransactions({ address, limit: 1 }))[0];
  if (!tx) {
    return [];
  }

  if (tx.timestamp <= lastTimestamp) {
    return [];
  }

  const txs = await getTransactions({ address, limit: 100 });
  return txs.filter((tx) => tx.timestamp > lastTimestamp);
}

function getTimestampKey(address: string) {
  const node = useSettingsStore.getState().settings.node;
  return `lastTxTimestamp-${address}-${node}`;
}
