import { hexStringtoUint8, uint8ToBase64 } from "@/utils";
import { MsgExecuteContractEncodeObject } from "@cosmjs/cosmwasm-stargate";
import { EncodeObject } from "@cosmjs/proto-signing";
import { DeliverTxResponse, MsgSendEncodeObject } from "@cosmjs/stargate";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { CosmToken } from "../types";
import {
  getAminoSigningClientAndSender,
  getDirectSigningClientAndSender,
  getSigningClientAndSender,
} from "./getSigningClientAndSender";
import { AminoTxnParams, DirectTxnParams, Transfer } from "./types";

export function getSendAnyTokensMsg(
  fromAddress: string,
  toAddress: string,
  token: CosmToken,
  amount: string,
): EncodeObject {
  if (token.type === "native" || token.type === "ics20") {
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

  return await client.signAndBroadcast(
    sender,
    [msg],
    transfer.fee,
    transfer.memo,
  );
}

export async function signGetAccountTxn() {
  const [client] = await getDirectSigningClientAndSender();
  const acc = await client.getAccounts();

  return [
    {
      algo: acc[0].algo,
      address: acc[0].address,
      pubkey: Buffer.from(acc[0].pubkey).toString("base64"),
    },
  ];
}

export async function signAminoTxn(params: AminoTxnParams) {
  const [client, sender] = await getAminoSigningClientAndSender();
  if (params.signerAddress !== sender) {
    throw new Error("Requested account is not an active one.");
  }

  return await client.signAmino(params.signerAddress, params.signDoc);
}

export async function signDirectTxn(params: DirectTxnParams) {
  const [client, sender] = await getDirectSigningClientAndSender();
  if (params.signerAddress !== sender) {
    throw new Error("Requested account is not an active one.");
  }

  // WC docs claim these should be uint arrays, while they're being sent as strings.
  params.signDoc.bodyBytes = hexStringtoUint8(params.signDoc.bodyBytes as any);
  params.signDoc.authInfoBytes = hexStringtoUint8(
    params.signDoc.authInfoBytes as any,
  );

  const resp = (await client.signDirect(
    params.signerAddress,
    params.signDoc,
  )) as any;
  resp.signed.authInfoBytes = uint8ToBase64(resp.signed.authInfoBytes);
  resp.signed.bodyBytes = uint8ToBase64(resp.signed.bodyBytes);

  return resp;
}
