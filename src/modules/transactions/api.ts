import { NODE_URL } from "@/const";
import { useSettingsStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { get } from "../api/api";
import { combineTransactionsWithStorage } from "./storage";
import { Transaction, TransactionData } from "./types";
import { parseMultiSend, parseSend } from "./utils";

const buildUrl = (queryParams: Record<string, string>): string => {
  const baseUrl = `https://rest.${NODE_URL[useSettingsStore.getState().settings.node]}/cosmos/tx/v1beta1/txs`;
  const queryString = Object.entries(queryParams)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join("&");
  return `${baseUrl}?${queryString}`;
};

const getTransactions = async (address: string): Promise<Transaction[]> => {
  const senderParams = {
    events: `transfer.sender='${address}'`,
    limit: "10",
  };

  const receiverParams = {
    events: `transfer.recipient='${address}'`,
    limit: "10",
  };

  const sendUrl = buildUrl(senderParams);
  const receivedUrl = buildUrl(receiverParams);
  const [sendData, receivedData] = await Promise.all([
    get<TransactionData>(sendUrl),
    get<TransactionData>(receivedUrl),
  ]);
  const response: Transaction[] = [
    ...sendData.data.tx_responses,
    ...receivedData.data.tx_responses,
  ]
    .filter((resp) => resp.tx.body.messages[0] !== undefined)
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
    .map((resp) => {
      const commonPath = resp.tx.body.messages[0];
      const isMultiSend =
        commonPath["@type"] === "/cosmos.bank.v1beta1.MsgMultiSend";

      const asset = "usei";
      const date = new Date(resp.timestamp).toISOString();

      if (isMultiSend) {
        return {
          ...parseMultiSend(commonPath, address),
          asset,
          date,
          fee: BigInt((resp as any).gas_used),
          status: "success",
          hash: resp.txhash,
        };
      } else {
        return {
          ...parseSend(commonPath, address),
          asset,
          date,
          fee: BigInt((resp as any).gas_used),
          status: "success",
          hash: resp.txhash,
        };
      }
    });
  return response;
};

export const useTransactions = (address: string) =>
  useQuery({
    queryKey: ["transactions", address],
    queryFn: () =>
      getTransactions(address).then((response) =>
        combineTransactionsWithStorage(address, response),
      ),
  });
