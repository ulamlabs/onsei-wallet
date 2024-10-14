import { NODE_URL } from "@/const";
import { useSettingsStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { createPublicClient, http } from "viem";
import { sei, seiTestnet } from "viem/chains";
import { get } from "../api/api";
import { parseEvmToTransaction, parseTx } from "./parsing";
import { combineTransactionsWithStorage } from "./storage";
import {
  RpcResponseTxs,
  Transaction,
  TransactionsData,
  TxEvent,
} from "./types";
import { getTxEventQueries } from "./utils";

type GetTransactionsOptions = {
  address: string;
  limit?: number;
};

export const getTransactions = async (
  options: GetTransactionsOptions,
): Promise<Transaction[]> => {
  const limit = options.limit ?? 10;

  const node = useSettingsStore.getState().settings.node;
  const url = `https://rest.${NODE_URL[node]}/cosmos/tx/v1beta1/txs`;
  const rpcUrl = `https://rpc.${NODE_URL[node]}/tx_search?query=coin_received.receiver%3D%27${options.address}%27`;
  const events = getTxEventQueries(options.address);

  const txs = await Promise.all(
    events.map((events) =>
      get<TransactionsData>(url, { params: { events, limit } }),
    ),
  );

  const rpcTxs = await get<RpcResponseTxs>(rpcUrl);
  const publicClient = createPublicClient({
    chain: node === "MainNet" ? sei : seiTestnet,
    transport: http(),
  });

  const evmTxsList = rpcTxs.data.txs.filter(
    (resp) => resp.tx_result.evm_tx_info?.txHash,
  );

  const evmTxsLogs: { events: TxEvent[] }[] = evmTxsList.map((resp) =>
    JSON.parse(resp.tx_result.log),
  )[0];

  const evmTxsHashes = evmTxsList.map(
    (resp) => resp.tx_result.evm_tx_info!.txHash,
  );

  const evmTxs = await Promise.all(
    evmTxsHashes?.map((hash) => publicClient.getTransaction({ hash })),
  );

  const evmTxsReceipt = await Promise.all(
    evmTxsHashes?.map((hash) => publicClient.getTransactionReceipt({ hash })),
  );

  const evmBlocks = await Promise.all(
    evmTxs.map((tx) => publicClient.getBlock({ blockHash: tx.blockHash })),
  );

  const parsedEvm = evmTxs.map((tx, index) => {
    return {
      ...parseEvmToTransaction(
        tx,
        undefined,
        evmTxsReceipt[index].status,
        evmTxsLogs[index]?.events,
      ),
      timestamp: new Date(+evmBlocks[index].timestamp.toString() * 1000),
    };
  });

  return [
    ...txs
      .filter(
        (tx) =>
          !evmTxsList.some(
            (evmTx) => evmTx.hash === tx.data.tx_responses[0]?.txhash,
          ),
      )
      .flatMap((tx) => tx.data.tx_responses.map((tx) => parseTx(tx))),
    ...parsedEvm,
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const useTransactions = (address: string) =>
  useQuery({
    queryKey: ["transactions", address],
    queryFn: () =>
      getTransactions({ address }).then((response) =>
        combineTransactionsWithStorage(address, response),
      ),
  });
