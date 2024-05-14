import { NODE_URL } from "@/const";
import { useAccountsStore, useSettingsStore, useTokensStore } from "@/store";
import { StdFee } from "@cosmjs/stargate";
import {
  getSigningStargateClient,
  isValidSeiCosmosAddress,
  restoreWallet,
} from "@sei-js/cosmjs";

export class TransactionsService {
  private accountsStore = useAccountsStore();
  private tokensStore = useTokensStore();
  private settingsStore = useSettingsStore();

  async transferAsset(
    receiver: string,
    amount: number,
    fee: StdFee,
  ): Promise<string> {
    try {
      const { getMnemonic, activeAccount } = this.accountsStore;

      if (!activeAccount) {
        throw new Error("No active user");
      }

      const wallet = await restoreWallet(getMnemonic(activeAccount.address));
      const signingClient = await getSigningStargateClient(
        "https://rpc." + NODE_URL[this.settingsStore.settings.node],
        wallet,
      );

      const sendAmount = { amount: `${amount}`, denom: "usei" };
      const send = await signingClient.sendTokens(
        activeAccount.address,
        receiver,
        [sendAmount],
        fee,
      );

      this.tokensStore.updateBalances([this.tokensStore.sei]);

      return send.transactionHash;
    } catch (error: any) {
      console.error(error);
      throw new Error(error);
    }
  }

  validateTxnData(receiver: string, amount: number, fee: StdFee) {
    const { activeAccount } = this.accountsStore;
    const { sei } = this.tokensStore;

    if (!sei.balance) {
      throw Error("Cannot get balance");
    }

    if (!receiver || !amount) {
      throw Error("All inputs need to be filled");
    }

    if (receiver === activeAccount?.address) {
      throw Error("You cannot send funds to your own address");
    }

    if (!isValidSeiCosmosAddress(receiver)) {
      throw Error("Invalid receiver address");
    }

    if (Number.isNaN(amount) || amount === 0) {
      throw Error("Invalid amount entered");
    }

    const feeAmount = +fee.amount[0].amount;

    const funds = Number(sei.balance) ?? 0;
    if (amount > funds - feeAmount) {
      throw Error("Insufficient funds");
    }
  }
}
