import { Transaction } from "@/modules/transactions";
import {
  getAllKnownTransactionHashes,
  storeNewTransaction,
} from "@/modules/transactions/storage";
import { CosmToken, fetchCW20Token } from "@/services/cosmos";
import {
  useAccountsStore,
  useSettingsStore,
  useTokenRegistryStore,
  useTokensStore,
} from "@/store";
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
  let finalStatus = status;
  if (status !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  return finalStatus;
}

export async function notifyTx(
  tx: Transaction,
  addresses: Set<string>,
  isActive?: boolean,
): Promise<boolean> {
  const { tokenRegistryMap } = useTokenRegistryStore.getState();
  const { updateBalances } = useTokensStore.getState();
  const { activeAccount } = useAccountsStore.getState();

  if (!tx.token || !tx.to) {
    // We only care about incoming token transfers. We can't reliably link the tx to the account for other tx types.
    return false;
  }

  if (tx.to === activeAccount?.address) {
    await addTokenToTokens(tx.token);
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

  if (isActive) {
    await updateBalances();
  }

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

async function fetchAndValidateToken(
  tokenId: string,
): Promise<CosmToken | undefined> {
  if (!isValidSeiCosmosAddress(tokenId)) {
    return;
  }

  const {
    settings: { node },
  } = useSettingsStore.getState();

  try {
    const token = await fetchCW20Token(tokenId, node);
    return token;
  } catch {
    // It doesn't have to be a valid CW20 token.
    return;
  }
}

async function addTokenToRegistry(tokenId: string) {
  const { addCW20ToRegistry } = useTokenRegistryStore.getState();

  const token = await fetchAndValidateToken(tokenId);
  if (token) {
    await addCW20ToRegistry(token);
  }
}

async function addTokenToTokens(tokenId: string) {
  const { tokenMap, blacklistedTokensIds } = useTokensStore.getState();
  if (tokenMap.has(tokenId) || blacklistedTokensIds.has(tokenId)) {
    return;
  }

  const { addToken } = useTokensStore.getState();

  const token = await fetchAndValidateToken(tokenId);
  if (token) {
    await addToken(token);
  }
}
