import { DeliverTxResponse } from "@cosmjs/stargate";
import { Transaction, TxEvent, TxResponse } from "./types";

type TransactionEventParams = Pick<
  Transaction,
  "type" | "token" | "amount" | "from" | "to" | "contract" | "contractAction"
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

export function parseTx(tx: TxResponse, memo = ""): Transaction {
  return {
    timestamp: new Date(tx.timestamp),
    fee: BigInt(tx.gas_used),
    hash: tx.txhash,
    status: tx.code === 0 ? "success" : "fail",
    memo: tx.tx?.body?.memo || memo,
    ...getParamsFromEvents(tx),
  };
}

function getParamsFromEvents(tx: TxResponse): TransactionEventParams {
  const events = parseEvents(tx.events);

  const action = events["message.action"] ?? "";

  const result: TransactionEventParams = {
    type: action.split(".").at(-1) ?? "",
    contract: "",
    contractAction: events["wasm.action"] ?? "",
    token: "",
    amount: 0n,
    from: "",
    to: "",
  };

  if (
    action === "/cosmos.bank.v1beta1.MsgSend" ||
    action === "/cosmos.bank.v1beta1.MsgMultiSend"
  ) {
    parseMsgSend(result, events);
  } else if (action === "/cosmwasm.wasm.v1.MsgExecuteContract") {
    parseMsgExecuteContract(result, events);
  }

  return result;
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
  while (firstNonDigitIndex < amountAndDenom.length) {
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

export function parseEvents(events: TxEvent[]) {
  const result: Record<string, string> = {};
  for (const event of events) {
    for (const attr of event.attributes) {
      const key = `${event.type}.${atob(attr.key as any)}`;
      const value = atob(attr.value as any);
      result[key] = value;
    }
  }
  return result;
}
