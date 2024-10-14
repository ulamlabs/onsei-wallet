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
  const accountEvmAddress = account.evmAddress?.toLowerCase();
  const accountAddress = account.address.toLowerCase();
  const txnFrom = txn.from.toLowerCase();
  const txnTo = txn.to.toLowerCase();
  if (txnFrom === accountAddress || txnFrom === accountEvmAddress) {
    return "sent";
  }
  if (txnTo === accountAddress || txnTo === accountEvmAddress) {
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
