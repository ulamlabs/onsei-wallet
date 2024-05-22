export type Transaction = {
  amount: bigint;
  fee: bigint;
  asset: string;
  date: string;
  from: string;
  to: string;
  type: string;
  status: "success" | "fail";
  hash: string;
};

export type Coin = { denom: string; amount: string };

export type MsgSend = {
  "@type": "/cosmos.bank.v1beta1.MsgSend";
  from_address: string;
  to_address: string;
  amount: Coin[];
};

export type MsgMultiSend = {
  "@type": "/cosmos.bank.v1beta1.MsgMultiSend";
  inputs: { address: string; coins: Coin[] }[];
  outputs: { address: string; coins: Coin[] }[];
};

export type TxResponse = {
  txhash: string;
  tx: {
    body: {
      messages: MsgSend[] | MsgMultiSend[];
    };
  };
  timestamp: string;
};

export type TransactionData = {
  tx_responses: TxResponse[];
};
