import { Core } from "@walletconnect/core";
import { ICore } from "@walletconnect/types";
import { IWeb3Wallet, Web3Wallet } from "@walletconnect/web3wallet";

export let web3wallet: IWeb3Wallet;
export let core: ICore;

export async function createWeb3Wallet() {
  core = new Core({
    projectId: process.env.EXPO_PUBLIC_WALLETCONNECT_ID,
  });

  web3wallet = await Web3Wallet.init({
    core,
    metadata: {
      name: "onsei wallet",
      description: "onsei wallet",
      url: "ulam.io",
      // TODO: add proper icon
      icons: ["https://avatars.githubusercontent.com/u/37784886"],
    },
  });
}

export async function onConnect(uri: string) {
  return await web3wallet.core.pairing.pair({ uri });
}
