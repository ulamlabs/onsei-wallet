import { NODE_URL } from "@/const";
import { useSettingsStore } from "@/store";
import { fetchData, formatDate } from "@/utils";
import { useQuery } from "@tanstack/react-query";

export type Transaction = {
  amount: number;
  asset: string;
  date: string;
  from: string;
  to: string;
  type: string;
};

type TxResponse = {
  txhash: string;
  tx: {
    body: {
      messages: {
        from_address: string;
        to_address: string;
        amount: { denom: "string"; amount: "string" }[];
      }[];
    };
  };
  timestamp: string;
};

type TransactionData = {
  tx_responses: TxResponse[];
};

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
    .filter((resp) => resp.tx.body.messages[0]?.amount !== undefined)
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
    .map((resp) => {
      return {
        amount: +resp.tx.body.messages[0]?.amount[0]?.amount / 10 ** 6,
        asset: "SEI",
        date: formatDate(resp.timestamp),
        from: resp.tx.body.messages[0]?.from_address,
        to: resp.tx.body.messages[0]?.to_address,
        type:
          resp.tx.body.messages[0]?.from_address === address
            ? "Send"
            : "Receive",
      };
    });
  return response;
};

export const useTransactions = (address: string) =>
  useQuery({
    queryKey: ["GET", address],
    queryFn: () => getTransactions(address),
  });
