import { Transaction } from "@/modules/transactions";
import { CosmTokenWithBalance } from "@/services/cosmos";
import {
  Account,
  useAccountsStore,
  useAddressBookStore,
  useTokenRegistryStore,
} from "@/store";
import { format, isToday } from "date-fns";

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
  account: Account,
): SentOrReceived {
  if (
    txn.from === account.address ||
    txn.from === account.evmAddress?.toLowerCase()
  ) {
    return "sent";
  }
  if (
    txn.to === account.address ||
    txn.to === account.evmAddress?.toLowerCase()
  ) {
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
