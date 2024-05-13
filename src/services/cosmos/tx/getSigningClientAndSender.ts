import { NODE_URL } from "@/const";
import { useAccountsStore, useSettingsStore } from "@/store";
import { SigningStargateClient } from "@cosmjs/stargate";
import { getSigningStargateClient, restoreWallet } from "@sei-js/cosmjs";

export async function getSigningClientAndSender(): Promise<
  [SigningStargateClient, string]
> {
  const { getMnemonic, activeAccount } = useAccountsStore.getState();
  const {
    settings: { node },
  } = useSettingsStore.getState();

  if (!activeAccount) {
    throw Error("No active account");
  }

  const wallet = await restoreWallet(getMnemonic(activeAccount.address));
  const client = await getSigningStargateClient(
    "https://rpc." + NODE_URL[node],
    wallet,
  );

  return [client as any, activeAccount.address];
}
