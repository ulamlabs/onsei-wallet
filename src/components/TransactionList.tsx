import { Transaction } from "@/modules/transactions";
import { useTokensStore } from "@/store";
import { Colors } from "@/styles";
import { formatAmount, formatDate } from "@/utils";
import { trimAddress } from "@/utils/trimAddress";
import { View } from "react-native";
import Box from "./Box";
import { Column } from "./layout";
import { Text } from "./typography";

type TransactionRenderProps = {
  txn: Transaction;
};

type TransactionListProps = {
  transactions: Transaction[];
};

const unknownAsset = {
  symbol: "?",
  decimals: 6,
};

function TransactionBox({ txn }: TransactionRenderProps) {
  const { tokenMap } = useTokensStore();
  const asset = tokenMap.get(txn.asset) || unknownAsset;

  return (
    <Box>
      <View>
        <Text>{txn.type}</Text>
        <Text style={{ color: Colors.text100 }}>
          {trimAddress(txn.type === "Send" ? txn.to : txn.from)}
        </Text>
      </View>

      <Text
        style={{
          color: txn.type === "Send" ? Colors.danger : Colors.success,
        }}
      >
        {txn.type === "Send" ? "-" : "+"}
        {formatAmount(txn.amount, asset.decimals)} {asset.symbol}
      </Text>
    </Box>
  );
}

export default function TransactionList({
  transactions,
}: TransactionListProps) {
  function isSameDay(date1: Date, date2: Date) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  return (
    <Column>
      {transactions.map((item, index) => (
        <View key={index} style={{ marginTop: 20, gap: 10 }}>
          {(index === 0 ||
            !isSameDay(
              new Date(item.date),
              new Date(transactions[index - 1].date),
            )) && <Text>{formatDate(item.date)}</Text>}

          <TransactionBox txn={item} />
        </View>
      ))}
    </Column>
  );
}
