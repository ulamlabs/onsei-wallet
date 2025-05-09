import { CosmTokenWithBalance } from "@/services/cosmos";
import { dataToMemo } from "@/services/evm";
import { SZABO, erc20TransferSignature } from "@/services/evm/consts";
import { DeliverTxResponse } from "@cosmjs/stargate";
import { etherUnits, Transaction as evmTx } from "viem";
import { Transaction, TxEvent, TxResponse } from "./types";

type TransactionEventParams = Pick<
  Transaction,
  | "type"
  | "token"
  | "amount"
  | "from"
  | "to"
  | "contract"
  | "contractAction"
  | "sender"
>;

export function deliverTxResponseToTxResponse(
  tx: DeliverTxResponse,
): TxResponse {
  return {
    code: tx.code,
    events: tx.events.map((e) => {
      return {
        type: e.type,
        attributes: e.attributes.map((a) => {
          return {
            key: btoa(a.key),
            value: btoa(a.value),
          };
        }),
      };
    }),
    gas_used: tx.gasUsed.toString(),
    gas_wanted: tx.gasWanted.toString(),
    timestamp: new Date().toISOString(),
    txhash: tx.transactionHash,
  };
}

export function websocketTxToTxResponse(tx: any): TxResponse {
  const result = tx.data.value.TxResult.result;
  return {
    code: 0,
    events: tx.data.events || result.events,
    gas_used: result.gas_used.toString(),
    gas_wanted: result.gas_wanted.toString(),
    // Timestamp is missing in websocket data. We might pull it from the block data in the future but using the current date is good enough as websockets are "real time".
    timestamp: new Date().toISOString(),
    txhash: tx.events["tx.hash"][0] ?? "",
    to: tx.events["coin_received.receiver"][0] || "",
  };
}

export function parseTx(
  tx: TxResponse,
  memo = "",
  simulatedFee = "",
): Transaction {
  const fee = simulatedFee || tx.tx?.auth_info?.fee?.amount[0]?.amount;
  return {
    timestamp: new Date(tx.timestamp),
    fee: fee ? BigInt(fee) : 0n,
    hash: tx.txhash,
    status: tx.code === 0 ? "success" : "fail",
    memo: tx.tx?.body?.memo || memo,
    ...getParamsFromEvents(tx),
  };
}

function getParamsFromEvents(tx: TxResponse): TransactionEventParams {
  const events = parseEvents(tx.events);
  const action = events["message.action"] ?? "";
  const receiver = events["coin_received.receiver"] ?? "";
  const result: TransactionEventParams = {
    sender: events["signer.sei_addr"] ?? events["message.sender"] ?? "",
    type: action.split(".").at(-1) ?? "",
    contract: "",
    contractAction: events["wasm.action"] ?? "",
    token: "",
    amount: 0n,
    from: "",
    to: tx.to || receiver || "",
  };

  if (
    action === "/cosmos.bank.v1beta1.MsgSend" ||
    action === "/cosmos.bank.v1beta1.MsgMultiSend"
  ) {
    parseMsgSend(result, events);
  } else if (action === "/cosmwasm.wasm.v1.MsgExecuteContract") {
    parseMsgExecuteContract(result, events);
  } else if (action === "/seiprotocol.seichain.evm.MsgEVMTransaction") {
    parseMsgEVMTransaction(result, events);
  }
  return result;
}

function parseMsgEVMTransaction(
  result: TransactionEventParams,
  events: Record<string, string>,
) {
  const from = events["signer.evm_addr"] || events["signer.sei_addr"] || "";
  const [amount, token] = splitAmountAndDenom(events["coin_spent.amount"]);

  if (token && amount) {
    Object.assign(result, { token, from, amount });
  }
}

function parseMsgSend(
  result: TransactionEventParams,
  events: Record<string, string>,
) {
  const from = events["transfer.sender"] ?? ""; // might be missing in MsgMultiSend
  const to = events["transfer.recipient"];
  const [amount, token] = splitAmountAndDenom(events["transfer.amount"]);

  if (token && to && amount) {
    Object.assign(result, { token, from, to, amount });
  }
}

function parseMsgExecuteContract(
  result: TransactionEventParams,
  events: Record<string, string>,
) {
  result.contract = events["execute._contract_address"];

  if (result.contractAction === "transfer") {
    // might be CW20
    const cw20Data = parseCw20Events(events);
    if (cw20Data) {
      Object.assign(result, cw20Data);
    }
  }
}

function parseCw20Events(events: Record<string, string>) {
  if (events["wasm.action"] !== "transfer") {
    return null;
  }

  const token = events["execute._contract_address"];
  const from = events["wasm.from"];
  const to = events["wasm.to"];
  const amount = events["wasm.amount"];
  if (!(token && from && to && amount)) {
    return null;
  }

  return { token, from, to, amount: BigInt(amount) };
}

function splitAmountAndDenom(amountAndDenom: string): [bigint, string] {
  // converts "1000usei" into [1000n, "usei"]
  let firstNonDigitIndex = 0;
  while (firstNonDigitIndex < amountAndDenom?.length) {
    if (!isDigit(amountAndDenom[firstNonDigitIndex])) {
      const amount = BigInt(amountAndDenom.substring(0, firstNonDigitIndex));
      const denom = amountAndDenom.substring(firstNonDigitIndex);
      return [amount, denom];
    }
    firstNonDigitIndex++;
  }

  return [0n, ""];
}

function isDigit(char: string) {
  return char >= "0" && char <= "9";
}

export function parseEvents(events: TxEvent[], decode = true) {
  const result: Record<string, string> = {};
  for (const event of events) {
    for (const attr of event.attributes) {
      const key = `${event.type}.${decode ? atob(attr.key as any) : attr.key}`;
      const value = decode ? atob(attr.value as any) : attr.value;
      result[key] = value;
    }
  }
  return result;
}

export function parseEvmToTransaction(
  tx: evmTx,
  token?: CosmTokenWithBalance,
  success?: "success" | "reverted",
  logs?: TxEvent[],
  contractHash?: string,
): Transaction {
  const events = logs ? parseEvents(logs || [], false) : "";
  const tokenLog = events
    ? splitAmountAndDenom(
        events["transfer.amount"] || events["coin_spent.amount"],
      )
    : "";

  const fee = (BigInt(tx.gas) * BigInt(tx.gasPrice || SZABO)) / SZABO;
  let contract = "";
  const contractAction = "";
  let to = tx.to || "";
  let amount =
    BigInt(tx.value) / BigInt(10 ** (etherUnits.wei - (token?.decimals || 6)));
  let txType = "transfer";
  const status: "success" | "fail" = success === "success" ? "success" : "fail";
  const sender = tx.from;
  const memo = dataToMemo(tx.input);

  if (tx.input !== "0x") {
    const functionSignature = tx.input.slice(0, 10); // First 4 bytes is the function selector

    if (functionSignature === erc20TransferSignature) {
      // ERC-20 Token Transfer
      to = `0x${tx.input.slice(34, 74)}`; // Extract the 'to' address from the input data
      amount = BigInt(`0x${tx.input.slice(74, 138)}`); // Extract and convert the amount
      contract = tx.to || "";
      txType = "contract";
    }
  }

  return {
    token: token?.id || tokenLog[1] || contract || "",
    from: tx.from,
    to,
    type: txType,
    status,
    hash: tx.hash,
    contract: contractHash || contract,
    contractAction,
    sender,
    memo,
    amount,
    fee,
    timestamp: new Date(),
  };
}
