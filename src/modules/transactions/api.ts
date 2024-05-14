import { NODE_URL } from "@/const";
import { useSettingsStore } from "@/store";
import { fetchData, formatDate } from "@/utils";
import { useQuery } from "@tanstack/react-query";
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
  const [sendData, receivedData]: TransactionData[] = await Promise.all([
    fetchData(sendUrl),
    fetchData(receivedUrl),
  ]);
  const response: Transaction[] = [
    ...sendData.tx_responses,
    ...receivedData.tx_responses,
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

      const asset = "SEI";
      const date = formatDate(resp.timestamp);

      if (isMultiSend) {
        return { ...parseMultiSend(commonPath, address), asset, date };
      } else {
        return { ...parseSend(commonPath, address), asset, date };
      }
    });
  return response;
};

export const useTransactions = (address: string) =>
  useQuery({
    queryKey: ["transactions", address],
    queryFn: () => getTransactions(address),
  });
