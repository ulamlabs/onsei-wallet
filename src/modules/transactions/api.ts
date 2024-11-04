import { NODE_URL } from "@/const";
import {
  EVM_RPC_MAIN,
  EVM_RPC_TEST,
  erc20TransferSignature,
} from "@/services/evm/consts";
import { useSettingsStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { RpcTransactionReceipt, Transaction as evmTx } from "viem";
import { api, get } from "../api/api";
import { parseEvmToTransaction, parseTx } from "./parsing";
import { combineTransactionsWithStorage } from "./storage";
import {
  BlockResponse,
  PointeeResponse,
  RpcResponseTxs,
  Transaction,
  TransactionsData,
  TxEvent,
} from "./types";
import { getRpcQueries, getTxEventQueries } from "./utils";

type GetTransactionsOptions = {
  address: string;
  limit?: number;
};

const getNodeUrl = (endpoint: string) => {
  const node = useSettingsStore.getState().settings.node;
  return `https://rest.${NODE_URL[node]}${endpoint}`;
};

export const getTokenPointee = async (
  address: `0x${string}` | undefined,
): Promise<PointeeResponse | undefined> => {
  if (!address) {
    return undefined;
  }
  try {
    const url = getNodeUrl(
      `/sei-protocol/seichain/evm/pointee?pointerType=3&pointer=${address}`,
    );
    const { data } = await get<PointeeResponse>(url);
    return data;
  } catch (error) {
    console.error("Failed to get token pointee:", error);
    throw new Error("Token pointee fetch error");
  }
};

export const getBlockByHeight = async (height: number, rpcUrl: string) => {
  try {
    const { data } = await get<BlockResponse>(
      `${rpcUrl}/block?height=${height}`,
    );
    return data;
  } catch (error) {
    console.error("Failed to fetch block:", error);
    throw new Error("Block fetch error");
  }
};

export const getTxReceipt = async (hash: string) => {
  const emvRpcUrl =
    useSettingsStore.getState().settings.node === "MainNet"
      ? EVM_RPC_MAIN
      : EVM_RPC_TEST;
  try {
    const { data } = await api.post(emvRpcUrl, {
      jsonrpc: "2.0",
      method: "eth_getTransactionReceipt",
      params: [hash],
      id: 2,
    });
    return data.result as RpcTransactionReceipt;
  } catch (error) {
    console.error("Failed to fetch transaction receipt:", error);
    throw new Error("Transaction receipt fetch error");
  }
};

export const getTxByHash = async (hash: string) => {
  const node = useSettingsStore.getState().settings.node;
  const emvRpcUrl = node === "MainNet" ? EVM_RPC_MAIN : EVM_RPC_TEST;
  try {
    const { data } = await api.post<{ result: evmTx }>(emvRpcUrl, {
      jsonrpc: "2.0",
      method: "eth_getTransactionByHash",
      params: [hash],
      id: 2,
    });
    return data.result;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch transaction");
  }
};

export const getTransactions = async (
  options: GetTransactionsOptions,
): Promise<Transaction[]> => {
  const limit = options.limit ?? 10;

  const node = useSettingsStore.getState().settings.node;
  const cosmosTxsUrl = getNodeUrl("/cosmos/tx/v1beta1/txs");
  const baseRpcUrl = `https://rpc.${NODE_URL[node]}`;
  const rpcUrl = `${baseRpcUrl}/tx_search?query=`;
  const events = getTxEventQueries(options.address);
  const rpcQueries = getRpcQueries(options.address);

  const txs = await Promise.all(
    events.map((events) =>
      get<TransactionsData>(cosmosTxsUrl, { params: { events, limit } }),
    ),
  );

  const rpcTxs = await Promise.all(
    rpcQueries.map((query) =>
      get<RpcResponseTxs>(rpcUrl + query).then((res) => res.data.txs),
    ),
  ).then((res) => [...res[0], ...res[1]]);

  const rpcTxsList = rpcTxs.filter(
    (obj, index) =>
      rpcTxs.findIndex((item) => item.hash === obj.hash) === index,
  );

  const evmTxsList = rpcTxsList.filter(
    (resp) => resp.tx_result.evm_tx_info?.txHash,
  );

  const evmTxsHashes = evmTxsList.map(
    (resp) => resp.tx_result.evm_tx_info!.txHash,
  );

  const evmTxs = await Promise.all(
    evmTxsHashes?.map((hash) => getTxByHash(hash)),
  );

  const aliveEvmTxs = evmTxsList.filter((tx, index) => evmTxs[index] !== null);
  const aliveEvmTxsWithTimestamp = aliveEvmTxs.map((tx) => ({
    ...tx,
    timestamp:
      txs.find((restTxs) =>
        restTxs.data.tx_responses.find((resp) => resp.txhash === tx.hash),
      )?.data.tx_responses[0].timestamp || undefined,
  }));

  const evmTxsReceipts = await Promise.all(
    aliveEvmTxs.map((tx) => getTxReceipt(tx.tx_result.evm_tx_info!.txHash)),
  );

  const evmTxsLogs: { events: TxEvent[] | undefined }[] = evmTxsList.map(
    (resp) => {
      return resp.tx_result.log === "execution reverted: evm reverted"
        ? {
            events: resp.tx_result.events || undefined,
          }
        : JSON.parse(resp.tx_result.log)[0];
    },
  );

  const evmBlocks = await Promise.all(
    aliveEvmTxsWithTimestamp.map((tx) => {
      if (tx.timestamp) {
        return { block: { header: { time: tx.timestamp } } };
      }
      return getBlockByHeight(+tx.height, baseRpcUrl);
    }),
  );

  const contracts = await Promise.all(
    evmTxs.map((tx) => {
      if (!tx.input.startsWith(erc20TransferSignature)) {
        return undefined;
      }

      const contract = getTokenPointee(tx.to || undefined);
      return contract;
    }),
  );

  const timeLimit = 31 * 24 * 60 * 60 * 1000; // 31 days in milliseconds
  const now = Date.now();
  const parsedEvm = aliveEvmTxs.map((tx, index) => {
    return {
      ...parseEvmToTransaction(
        evmTxs.filter((evmTx) => evmTx !== null)[index],
        undefined,
        evmTxsReceipts[index].status === "0x1" ? "success" : "reverted",
        evmTxsLogs[index].events,
        contracts[index]?.pointee,
      ),
      timestamp: evmBlocks[index].block?.header.time
        ? new Date(evmBlocks[index].block?.header.time)
        : new Date(now - timeLimit),
    };
  });

  const nonEvmTxs = txs
    .map((tx) =>
      tx.data.tx_responses.filter(
        (resp) => !evmTxsList.some((evmTx) => evmTx.hash === resp.txhash),
      ),
    )
    .flatMap((tx) => tx.map((resp) => parseTx(resp)));

  return [...nonEvmTxs, ...parsedEvm].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
  );
};

export const useTransactions = (address: string) =>
  useQuery({
    queryKey: ["transactions", address],
    queryFn: () =>
      getTransactions({ address }).then((response) =>
        combineTransactionsWithStorage(address, response),
      ),
  });
