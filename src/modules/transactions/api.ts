import { NODE_URL } from "@/const";
import { useSettingsStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { get } from "../api/api";
import { combineTransactionsWithStorage } from "./storage";
import { Transaction, TransactionsData } from "./types";
import { parseTx } from "./parsing";
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

  const events = getTxEventQueries(options.address);

  const txs = await Promise.all(
    events.map((events) =>
      get<TransactionsData>(url, { params: { events, limit } }),
    ),
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
