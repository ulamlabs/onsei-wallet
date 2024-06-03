import { format, isToday } from "date-fns";
import { Transaction } from "@/modules/transactions";
import { CosmTokenWithBalance } from "@/services/cosmos";
import { useAccountsStore, useAddressBookStore } from "@/store";

export type SentOrReceived = "sent" | "received" | "";

const unknownToken = {
  symbol: "?",
  decimals: 6,
  price: 0,
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

export function getTokenFromTxn(
  txn: Transaction,
  tokenMap: Map<string, CosmTokenWithBalance>,
) {
  return tokenMap.get(txn.token) || unknownToken;
}

export function getTxnDate(txn: Transaction) {
  if (isToday(txn.timestamp)) {
    return "Today " + format(txn.timestamp, "HH:mm");
  }
  return format(txn.timestamp, "dd LLLL HH:mm");
}
