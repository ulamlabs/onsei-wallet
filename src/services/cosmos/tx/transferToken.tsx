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
import {
  AminoTxnParams,
  DirectTxnParams,
  NFTTransfer,
  Transfer,
} from "./types";

export function getSendAnyTokensMsg(
  fromAddress: string,
  toAddress: string,
  data:
    | {
        isNFT: false;
        token: CosmToken;
        amount: string;
      }
    | {
        isNFT: true;
        contractAddress: string;
        tokenId: string;
      },
): EncodeObject {
  if (data.isNFT) {
    return getSendCW721TokenMsg(
      fromAddress,
      toAddress,
      data.contractAddress,
      data.tokenId,
    );
  }
  if (data.token?.type === "native" || data.token?.type === "ics20") {
    if (!data.token) {
      throw Error("Token is required");
    }
    if (!data.amount) {
      throw Error("Amount is required");
    }
    return getSendNativeTokenMsg(
      fromAddress,
      toAddress,
      data.token,
      data.amount,
    );
  } else if (data.token?.type === "cw20") {
    if (!data.token) {
      throw Error("Token is required");
    }
    if (!data.amount) {
      throw Error("Amount is required");
    }
    return getSendCW20TokenMsg(fromAddress, toAddress, data.token, data.amount);
  }

  throw Error(`Unsupported token type "${data.token?.type}"`);
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

function getSendCW721TokenMsg(
  sender: string,
  recipient: string,
  contractAddress: string,
  tokenId: string,
): MsgExecuteContractEncodeObject {
  const cleanTokenId = tokenId.trim();

  if (!/^[0-9]+$/.test(cleanTokenId)) {
    throw new Error(`TokenId must be numeric: ${tokenId}`);
  }

  const transferMsg = { transfer_nft: { recipient, token_id: cleanTokenId } };

  console.log("Transfer message:", JSON.stringify(transferMsg, null, 2));

  const encodedMsg = new TextEncoder().encode(JSON.stringify(transferMsg));
  console.log("Encoded bytes length:", encodedMsg.length);

  return {
    typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
    value: MsgExecuteContract.fromPartial({
      sender,
      contract: contractAddress,
      msg: encodedMsg,
    }),
  };
}

export async function transferToken(
  transfer: Transfer,
): Promise<DeliverTxResponse> {
  const [client, sender] = await getSigningClientAndSender();

  const msg = getSendAnyTokensMsg(sender, transfer.recipient, {
    isNFT: false,
    token: transfer.token,
    amount: transfer.intAmount.toString(),
  });
  console.log("ranX");
  return await client.signAndBroadcast(
    sender,
    [msg],
    transfer.fee,
    transfer.memo,
  );
}

export async function transferNFT(
  transfer: NFTTransfer,
): Promise<DeliverTxResponse> {
  const [client, sender] = await getSigningClientAndSender();

  // Ensure tokenId is a valid numeric string if it's meant to be numeric
  const cleanTokenId = transfer.tokenId.trim();

  // Add this check if tokenId must be numeric
  if (!/^-?[0-9]+$/.test(cleanTokenId)) {
    throw new Error(`TokenId must be numeric: ${transfer.tokenId}`);
  }
  // if (!/^[0-9]+$/.test(transfer.fee.gas)) {
  //   throw new Error(`Gas must be numeric: ${transfer.fee}`);
  // }
  // if (!/^[0-9]+$/.test(transfer.fee.amount[0].amount)) {
  //   throw new Error(`Amount must be numeric: ${transfer.fee}`);
  // }

  const msg = getSendAnyTokensMsg(sender, transfer.recipient, {
    isNFT: true,
    contractAddress: transfer.contractAddress,
    tokenId: cleanTokenId,
  });

  console.log({
    sender,
    msg,
    fee: transfer.fee,
    memo: transfer.memo,
  });

  try {
    return await client.signAndBroadcast(
      sender,
      [msg],
      transfer.fee,
      transfer.memo,
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log(
        "Error",
        JSON.stringify(
          {
            message: error.message,
            stack: error.stack,
            name: error.name,
            cause: error.cause,
          },
          null,
          2,
        ),
      );
    } else {
      console.log("error", error);
    }
    throw error;
  }
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
