import { Transaction } from "@/modules/transactions";
import {
  getAllKnownTransactionHashes,
  storeNewTransaction,
} from "@/modules/transactions/storage";
import { CosmToken, fetchCW20Token } from "@/services/cosmos";
import { useSettingsStore, useTokenRegistryStore } from "@/store";
import { formatAmount, trimAddress } from "@/utils";
import { isValidSeiCosmosAddress } from "@sei-js/cosmjs";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function grantNotificationsPermission() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    await Notifications.requestPermissionsAsync();
  }
}

export async function notifyTx(
  tx: Transaction,
  addresses: Set<string>,
): Promise<boolean> {
  const { tokenRegistryMap } = useTokenRegistryStore.getState();

  if (!tx.token || !tx.to) {
    // We only care about incoming token transfers. We can't reliably link the tx to the account for other tx types.
    return false;
  }

  if (!tokenRegistryMap.has(tx.token)) {
    await addTokenToRegistry(tx.token);
  }

  if (addresses.has(tx.sender)) {
    // Don't notify user's own transactions.
    return false;
  }

  // Don't notify already seen transactions.
  const knownHashes = await getAllKnownTransactionHashes(Array.from(addresses));
  if (knownHashes.has(tx.hash)) {
    return false;
  }

  await storeNewTransaction(tx.to, tx);

  const title = getTitle(tx, addresses);

  Notifications.scheduleNotificationAsync({
    content: { title, data: { txhash: tx.hash } },
    trigger: { seconds: 1 },
  });

  return true;
}

function getTitle(tx: Transaction, addresses: Set<string>): string {
  if (tx.token) {
    const sentOrReceived = addresses.has(tx.to) ? "Received" : "Sent";
    const token = useTokenRegistryStore
      .getState()
      .tokenRegistryMap.get(tx.token);
    if (!token) {
      return `${sentOrReceived} an unknown token from ${trimAddress(tx.from)}`;
    }
    return `${sentOrReceived} ${formatAmount(tx.amount, token.decimals)} ${token.symbol} from ${trimAddress(tx.from)}`;
  }

  if (tx.contract && tx.contractAction) {
    return `Executed ${tx.contractAction} on`;
  }
  return trimAddress(tx.hash);
}

async function addTokenToRegistry(tokenId: string) {
  const {
    settings: { node },
  } = useSettingsStore.getState();

  const { addCW20ToRegistry } = useTokenRegistryStore.getState();

  if (!isValidSeiCosmosAddress(tokenId)) {
    return;
  }

  let token: CosmToken;
  try {
    token = await fetchCW20Token(tokenId, node);
  } catch {
    // It doesn't have to be a valid CW20 token.
    return;
  }

  // TODO We should add the token to the account, not only to the registry. The issue is that we can do it easily only for the active account.
  await addCW20ToRegistry(token);
}
