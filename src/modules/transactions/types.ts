type TransactionBase = {
  token: string;
  from: string;
  to: string;
  type: string;
  status: "success" | "fail";
  hash: string;
  contract: string;
  contractAction: string;
  sender: string;
  memo: string;
};

export type Transaction = TransactionBase & {
  amount: bigint;
  fee: bigint;
  timestamp: Date;
};

export type NFTTransaction = {
  contractAddress: string;
  tokenId: string;
  from: string;
  to: string;
  type: string;
  status: "success" | "fail";
  hash: string;
  contractAction: string;
  sender: string;
  memo: string;
  fee: bigint;
  timestamp: Date;
};

export type SerializedTx = TransactionBase & {
  amount: string;
  fee: string;
  timestamp: string;
};

export type SerializedNftTxn = NFTTransaction & {
  fee: string;
  timestamp: string;
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
  tx?: TxData;
  to?: string;
};

export type TxEvent = {
  type: string;
  attributes: TxEventAttribute[];
};

export type TxEventAttribute = {
  key: string;
  value: string;
};

export type TxData = {
  "@type": string;
  body: TxBody;
  signatures: string[];
  auth_info: TxAuthInfo;
};

export type TokenBalance = {
  amount: string;
  denom: string;
};

export type TxAuthInfo = {
  fee: { amount: TokenBalance[] };
};

export type TxBody = {
  extension_options: string[];
  memo: string;
  messages: any[];
  non_critical_extension_options: string[];
  timeout_height: string;
};

export type EvmTransaction = {
  blockHash: string | null;
  blockNumber: number | null;
  chainId: number | undefined;
  from: string;
  gas: bigint;
  gasPrice: bigint;
  hash: string;
  input: string;
  nonce: number;
  r: string;
  s: string;
  to: string | null;
  transactionIndex: number | null;
  type: string;
  typeHex: string;
  v: bigint;
  value: bigint;
};

export type RpcResponseTxs = {
  total_count: number;
  txs: RpcResponseTx[];
};

export type RpcResponseTx = {
  hash: string;
  height: string;
  index: number;
  tx_result: {
    data: string;
    log: string;
    gas_wanted: string;
    gas_used: string;
    evm_tx_info?: {
      senderAddress: `0x${string}`;
      nonce: string;
      txHash: `0x${string}`;
    };
  };
};

export type BlockResponse = {
  block: { header: { height: string; time: string } };
};
