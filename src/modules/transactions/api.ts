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

const getTransactions = async (address: string): Promise<Transaction[]> => {
  const send = `https://rest.${NODE_URL[useSettingsStore.getState().settings.node]}/cosmos/tx/v1beta1/txs?events=transfer.sender%3D%27${address}%27&limit=10`;
  const received = `https://rest.${NODE_URL[useSettingsStore.getState().settings.node]}/cosmos/tx/v1beta1/txs?events=transfer.recipient%3D%27${address}%27&limit=10`;
  const sendData: TransactionData = await fetchData(send);
  const receivedData: TransactionData = await fetchData(received);
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
