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

type Coin = { denom: string; amount: string };

type MsgSend = {
  "@type": "/cosmos.bank.v1beta1.MsgSend";
  from_address: string;
  to_address: string;
  amount: Coin[];
};

type MsgMultiSend = {
  "@type": "/cosmos.bank.v1beta1.MsgMultiSend";
  inputs: { address: string; coins: Coin[] }[];
  outputs: { address: string; coins: Coin[] }[];
};

type TxResponse = {
  txhash: string;
  tx: {
    body: {
      messages: MsgSend[] | MsgMultiSend[];
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
    .filter((resp) => resp.tx.body.messages[0] !== undefined)
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
    .map((resp) => {
      const commonPath = resp.tx.body.messages[0];
      const isMultiSend =
        commonPath["@type"] === "/cosmos.bank.v1beta1.MsgMultiSend";

      const amount = isMultiSend
        ? +commonPath?.inputs[0].coins[0].amount / 10 ** 6
        : +commonPath?.amount[0]?.amount / 10 ** 6;

      const asset = "SEI";
      const date = formatDate(resp.timestamp);

      const from = isMultiSend
        ? commonPath.inputs[0].address
        : commonPath?.from_address;

      const to = isMultiSend
        ? commonPath.outputs[0].address
        : commonPath?.to_address;

      const type = isMultiSend
        ? commonPath.inputs[0].address === address
          ? "Send"
          : "Receive"
        : commonPath?.from_address === address
          ? "Send"
          : "Receive";

      return { amount, asset, date, from, to, type };
    });
  return response;
};

export const useTransactions = (address: string) =>
  useQuery({
    queryKey: ["transactions", address],
    queryFn: () => getTransactions(address),
  });
