import { NODE_URL } from "@/const";
import { useAccountsStore, useSettingsStore } from "@/store";
import { SigningStargateClient } from "@cosmjs/stargate";
import { Secp256k1HdWallet } from "@cosmjs/amino";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
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

export async function getDirectSigningClientAndSender() {
  return (await getWCSigningClientAndSender("direct")) as [
    DirectSecp256k1HdWallet,
    string,
  ];
}

export async function getAminoSigningClientAndSender() {
  return (await getWCSigningClientAndSender("amino")) as [
    Secp256k1HdWallet,
    string,
  ];
}

async function getWCSigningClientAndSender(walletType: "amino" | "direct") {
  const { getMnemonic, activeAccount } = useAccountsStore.getState();
  if (!activeAccount) {
    throw Error("No active account");
  }
  let wallet;
  if (walletType === "amino") {
    wallet = await Secp256k1HdWallet.fromMnemonic(
      getMnemonic(activeAccount.address),
      { prefix: "sei" },
    );
  } else {
    wallet = await DirectSecp256k1HdWallet.fromMnemonic(
      getMnemonic(activeAccount.address),
      { prefix: "sei" },
    );
  }

  return [wallet, activeAccount.address];
}
