import { DeliverTxResponse, MsgSendEncodeObject } from "@cosmjs/stargate";
import { MsgExecuteContractEncodeObject } from "@cosmjs/cosmwasm-stargate";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { EncodeObject } from "@cosmjs/proto-signing";
import { getSigningClientAndSender } from "./getSigningClientAndSender";
import { CosmToken } from "../types";
import { Transfer } from "./types";

export function getSendAnyTokensMsg(
  fromAddress: string,
  toAddress: string,
  token: CosmToken,
  amount: string,
): EncodeObject {
  if (token.type === "native") {
    return getSendNativeTokenMsg(fromAddress, toAddress, token, amount);
  } else if (token.type === "cw20") {
    return getSendCW20TokenMsg(fromAddress, toAddress, token, amount);
  } else {
    throw Error(`Unsupported token type "${token.type}"`);
  }
}

function getSendNativeTokenMsg(
  sender: string,
  recipient: string,
  token: CosmToken,
  amount: string,
): MsgSendEncodeObject {
  return {
    typeUrl: "/cosmos.bank.v1beta1.MsgSend",
    value: {
      fromAddress: sender,
      toAddress: recipient,
      amount: [{ denom: token.id, amount }],
    },
  };
}
function getSendCW20TokenMsg(
  sender: string,
  recipient: string,
  token: CosmToken,
  amount: string,
): MsgExecuteContractEncodeObject {
  const transfer = { transfer: { recipient, amount } };
  const msg = new TextEncoder().encode(JSON.stringify(transfer));

  return {
    typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
    value: MsgExecuteContract.fromPartial({
      sender,
      contract: token.id,
      msg,
    }),
  };
}

export async function transferToken(
  transfer: Transfer,
): Promise<DeliverTxResponse> {
  const [client, sender] = await getSigningClientAndSender();

  const msg = getSendAnyTokensMsg(
    sender,
    transfer.recipient,
    transfer.token,
    transfer.intAmount.toString(),
  );

  return await client.signAndBroadcast(sender, [msg], transfer.fee);
}
