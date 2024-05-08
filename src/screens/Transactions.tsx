import { Loader, Paragraph, Row, SafeLayout, Text } from "@/components";
import { Transaction, useTransactions } from "@/modules/transactions";
import { Colors } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { trimAddress } from "@/utils/trimAddress";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlatList, View } from "react-native";

type TransactionsProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Transactions"
>;

type TransactionRenderProps = {
  item: Transaction;
  index: number;
};

const Transactions = ({
  route: {
    params: { address },
  },
}: TransactionsProps) => {
  const { data: transactions, error, isLoading } = useTransactions(address);

  const renderTxn = ({ item, index }: TransactionRenderProps) => {
    return (
      <View style={{ marginTop: 20, gap: 10 }}>
        {(index === 0 || item.date !== transactions![index - 1].date) && (
          <Text>{item.date}</Text>
        )}

        <Row
          style={{
            backgroundColor: Colors.background200,
            padding: 15,
            borderRadius: 10,
          }}
        >
          <View>
            <Text>{item.type}</Text>
            <Text style={{ color: Colors.text100 }}>
              {trimAddress(item.type === "Send" ? item.to : item.from)}
            </Text>
          </View>

          <Text
            style={{
              color: item.type === "Send" ? Colors.danger : Colors.success,
            }}
          >
            {item.type === "Send" ? "-" : "+"}
            {item.amount} {item.asset}
          </Text>
        </Row>
      </View>
    );
  };

  return (
    <SafeLayout noScroll={true}>
      <View>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Paragraph>Somethinf went wrong</Paragraph>
        ) : (
          <View>
            {transactions && transactions?.length > 0 ? (
              <FlatList data={transactions} renderItem={renderTxn} />
            ) : (
              <Paragraph style={{ textAlign: "center" }}>
                No transactions yet
              </Paragraph>
            )}
          </View>
        )}
      </View>
    </SafeLayout>
  );
};

export default Transactions;
