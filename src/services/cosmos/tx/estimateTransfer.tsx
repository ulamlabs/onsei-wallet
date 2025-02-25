import { SigningStargateClient, StdFee, calculateFee } from "@cosmjs/stargate";
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
  preloadedData?: [SigningStargateClient, string],
): Promise<number> {
  const [client, sender] = preloadedData || (await getSigningClientAndSender());
  const msg = getSendAnyTokensMsg(sender, receiver, {
    isNFT: false,
    token,
    amount: amount.toString(),
  });
  const gas = await client.simulate(sender, [msg], undefined);
  return gas;
}

export async function estimateNftTransferGas(
  receiver: string,
  contractAddress: string,
  tokenId: string,
  preloadedData?: [SigningStargateClient, string],
): Promise<number> {
  const [client, sender] = preloadedData || (await getSigningClientAndSender());
  const msg = getSendAnyTokensMsg(sender, receiver, {
    isNFT: true,
    contractAddress,
    tokenId,
  });
  const gas = await client.simulate(sender, [msg], undefined);
  return gas;
}

export async function estimateTransferFee(
  receiver: string,
  token: CosmToken,
  amount: bigint,
  gasPrice: string,
  preloadedData?: [SigningStargateClient, string],
): Promise<StdFee> {
  const gas = await estimateTransferGas(receiver, token, amount, preloadedData);
  return estimateTransferFeeWithGas(gasPrice, gas);
}

export async function estimateNftTransferFee(
  receiver: string,
  contractAddress: string,
  tokenId: string,
  gasPrice: string,
  preloadedData?: [SigningStargateClient, string],
): Promise<StdFee> {
  const gas = await estimateNftTransferGas(
    receiver,
    contractAddress,
    tokenId,
    preloadedData,
  );
  return estimateTransferFeeWithGas(gasPrice, gas);
}

export function estimateTransferFeeWithGas(
  gasPrice: string,
  gas: number,
): StdFee {
  console.log("x:gas", gas);
  console.log("x:gasPrice", gasPrice);
  const fee = calculateFee(Math.ceil(gas * GAS_MULTIPLIER), gasPrice);
  console.log("x:fee", fee);
  return fee;
}
