import { format, isToday } from "date-fns";
import { Transaction } from "@/modules/transactions";
import { CosmTokenWithBalance } from "@/services/cosmos";
import {
  useAccountsStore,
  useAddressBookStore,
  useTokenRegistryStore,
} from "@/store";

export type SentOrReceived = "sent" | "received" | "";

const unknownToken = {
  symbol: "?",
  decimals: 6,
  balance: 0n,
};

export function getKnownAddress(address: string) {
  const { accounts } = useAccountsStore.getState();
  const { addressBook } = useAddressBookStore.getState();
  return [...accounts, ...addressBook].find((a) => a.address === address);
}

export function getSentOrReceived(
  txn: Transaction,
  activeAddress: string,
): SentOrReceived {
  if (txn.from === activeAddress) {
    return "sent";
  }
  if (txn.to === activeAddress) {
    return "received";
  }
  return "";
}

export function getTokenFromTxn(txn: Transaction) {
  const { tokenRegistryMap, tokenPricesMap } = useTokenRegistryStore.getState();

  return {
    ...unknownToken,
    ...tokenRegistryMap.get(txn.token),
    price: tokenPricesMap.get(txn.token)?.price || 0,
  } as CosmTokenWithBalance;
}

export function getTxnDate(txn: Transaction) {
  if (isToday(txn.timestamp)) {
    return "Today " + format(txn.timestamp, "HH:mm");
  }
  return format(txn.timestamp, "dd LLLL HH:mm");
}
