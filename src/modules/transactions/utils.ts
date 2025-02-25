import { SerializedTx, Transaction } from "./types";

export function getTxEventQueries(address: string) {
  return [
    `message.sender='${address}'`, // sending most transactions, including smart contracts
    `transfer.recipient='${address}'`, // receiving token
    `wasm.to='${address}'`, // receiving CW20
  ];
}

export function getRpcQueries(address: string) {
  return [
    `coin_spent.spender%3D%27${address}%27`,
    `coin_received.receiver%3D%27${address}%27`,
  ];
}

export const serializeTxn = (txn: Transaction) => {
  return {
    ...txn,
    amount: txn.amount.toString(),
    fee: txn.fee.toString(),
    timestamp: txn.timestamp.toISOString(),
  } as SerializedTx;
};

export const deserializeTxn = (txn: SerializedTx) => {
  return {
    ...txn,
    amount: BigInt(txn.amount),
    fee: BigInt(txn.fee || 0),
    timestamp: new Date(txn.timestamp),
  } as Transaction;
};
