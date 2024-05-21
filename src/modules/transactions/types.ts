export type Transaction = {
  amount: bigint;
  fee: bigint;
  token: string;
  timestamp: Date;
  from: string;
  to: string;
  type: string;
  status: "success" | "fail";
  hash: string;
  contract: string;
  contractAction: string;
};

export type TransactionsData = {
  tx_responses: TxResponse[];
};

export type TxResponse = {
  txhash: string;
  timestamp: string;
  gas_used: string;
  gas_wanted: string;
  code: number;
  events: TxEvent[];
};

export type TxEvent = {
  type: string;
  attributes: TxEventAttribute[];
};

export type TxEventAttribute = {
  key: string;
  value: string;
};
