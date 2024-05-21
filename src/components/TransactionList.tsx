import { Transaction } from "@/modules/transactions";
import { useTokensStore } from "@/store";
import { Colors } from "@/styles";
import { formatAmount } from "@/utils";
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

function TransactionBox({ txn }: TransactionRenderProps) {
  const { sei } = useTokensStore();

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
        {formatAmount(txn.amount, sei.decimals)} {txn.asset}
      </Text>
    </Box>
  );
}

export default function TransactionList({
  transactions,
}: TransactionListProps) {
  return (
    <Column>
      {transactions.map((item, index) => (
        <View key={index} style={{ marginTop: 20, gap: 10 }}>
          {(index === 0 || item.date !== transactions![index - 1].date) && (
            <Text>{item.date}</Text>
          )}

          <TransactionBox txn={item} />
        </View>
      ))}
    </Column>
  );
}
