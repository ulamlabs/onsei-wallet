import { StdFee } from "@cosmjs/stargate";
import { getEvmClient } from "../utils";

export async function simulateLegacyTx(
  mnemonic: string,
  receiver: `0x${string}`,
  amount: bigint,
) {
  const evmClient = await getEvmClient(mnemonic);
  const { account, walletClient } = evmClient;
  const request = await walletClient.prepareTransactionRequest({
    account,
    to: receiver,
    value: amount * 10n ** BigInt(12),
    type: "legacy",
  });
  const fee = (request.gas * request.gasPrice) / 10n ** BigInt(12);

  const stdFee: StdFee = {
    amount: [{ amount: `${+fee.toString()}`, denom: "usei" }],
    gas: "",
  };
  const serializedTransaction = await walletClient.signTransaction(request);
  return { stdFee, serializedTransaction };
}
