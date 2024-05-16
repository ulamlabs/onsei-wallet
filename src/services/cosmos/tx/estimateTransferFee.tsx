import { StdFee, calculateFee } from "@cosmjs/stargate";
import { getSigningClientAndSender } from "./getSigningClientAndSender";
import { getSendAnyTokensMsg } from "./transferToken";
import { CosmToken } from "../types";

const GAS_PRICE: string = "0.1usei";

// Multiply by the same factor the SDK is doing in auto mode
// https://github.com/cosmos/cosmjs/blob/5c1ec56189d3024a6c6ad0ec0d60df30c09c7cc0/packages/stargate/src/signingstargateclient.ts#L313
const GAS_MULTIPLIER = 1.4;

export async function estimateTransferFee(
  receiver: string,
  token: CosmToken,
  amount: string,
): Promise<StdFee> {
  const [client, sender] = await getSigningClientAndSender();
  const msg = getSendAnyTokensMsg(sender, receiver, token, amount);
  const gas = await client.simulate(sender, [msg], undefined);
  return calculateFee(Math.ceil(gas * GAS_MULTIPLIER), GAS_PRICE);
}
