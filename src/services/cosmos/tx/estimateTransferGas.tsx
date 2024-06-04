import { StdFee, calculateFee } from "@cosmjs/stargate";
import { CosmToken } from "../types";
import { getSigningClientAndSender } from "./getSigningClientAndSender";
import { getSendAnyTokensMsg } from "./transferToken";

// Multiply by the same factor the SDK is doing in auto mode
// https://github.com/cosmos/cosmjs/blob/5c1ec56189d3024a6c6ad0ec0d60df30c09c7cc0/packages/stargate/src/signingstargateclient.ts#L313
const GAS_MULTIPLIER = 1.4;

export async function estimateTransferGas(
  receiver: string,
  token: CosmToken,
  amount: bigint,
): Promise<number> {
  const [client, sender] = await getSigningClientAndSender();
  const msg = getSendAnyTokensMsg(sender, receiver, token, amount.toString());
  const gas = await client.simulate(sender, [msg], undefined);
  return gas;
}

export async function estimateTransferFee(
  receiver: string,
  token: CosmToken,
  amount: bigint,
  gasPrice: string,
): Promise<StdFee> {
  const gas = await estimateTransferGas(receiver, token, amount);
  return calculateFee(Math.ceil(gas * GAS_MULTIPLIER), gasPrice);
}
