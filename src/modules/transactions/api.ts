import { NODE_URL } from "@/const";
import { useSettingsStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { createPublicClient, http } from "viem";
import { sei, seiTestnet } from "viem/chains";
import { get } from "../api/api";
import { parseTx } from "./parsing";
import { combineTransactionsWithStorage } from "./storage";
import { RpcResponseTxs, Transaction, TransactionsData } from "./types";
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

  const evmTxsHashes = rpcTxs.data.txs
    .filter((resp) => resp.tx_result.evm_tx_info?.txHash)
    .map((resp) => resp.hash); // SEI hashes that were sent on evm
  console.log(evmTxsHashes);
  const evmTxs = await Promise.all(
    evmTxsHashes.map((hash) =>
      get<TransactionsData>(
        `https://rest.${NODE_URL[node]}/cosmos/tx/v1beta1/txs/${hash}`,
      ),
    ),
  );
  // const evmTxs = await Promise.all(
  //   evmTxsHashes.map((hash) => publicClient.getTransactionReceipt({ hash })),
  // );
  // console.log(evmTxs);
  console.log(
    evmTxs.flatMap((tx) => tx.data.tx_responses.map((tx) => parseTx(tx))),
  );

  return txs
    .flatMap((tx) => tx.data.tx_responses.map((tx) => parseTx(tx)))
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const useTransactions = (address: string) =>
  useQuery({
    queryKey: ["transactions", address],
    queryFn: () =>
      getTransactions({ address }).then((response) =>
        combineTransactionsWithStorage(address, response),
      ),
  });
