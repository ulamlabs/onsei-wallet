import { Loader, Paragraph, Row, SafeLayout, Text } from "@/components";
import { useAccountsStore } from "@/store";
import { Colors } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";

type TransactionsProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Transactions"
>;

type Transaction = {
  type: "Send" | "Receive";
  from: string;
  to: string;
  amount: string;
  asset: string;
  date: string;
};

type TransactionRenderProps = {
  item: Transaction;
  index: number;
};

const Transactions = ({
  route: {
    params: { address },
  },
}: TransactionsProps) => {
  const [loading, setLoading] = useState(false);
  const [isMore, setIsMore] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { fetchTxns } = useAccountsStore();
  // const transactions: Transaction[] = [
  //   {
  //     amount: "0",
  //     asset: "213",
  //     date: "1123",
  //     from: "123",
  //     to: "123",
  //     type: "Receive",
  //   },
  //   {
  //     amount: "0",
  //     asset: "213",
  //     date: "1123",
  //     from: "123",
  //     to: "123",
  //     type: "Receive",
  //   },
  //   {
  //     amount: "0",
  //     asset: "213",
  //     date: "1123",
  //     from: "123",
  //     to: "123",
  //     type: "Send",
  //   },
  // ];

  useEffect(() => {
    fetchTxns();
    // If there's any notification about balance change, remove it, because user will now see it on txs list
    // cancelNotification(address); TODO: cancel notification
  }, []);

  // async function fetchTxns(page: number) {
  //   // TODO: handle fetching transactions
  // }

  // function fetchNextPage() {
  //   if (isMore) {
  //     fetchTxns(transactions.length / 20);
  //   }
  // }

  const renderTxn = ({ item, index }: TransactionRenderProps) => {
    return (
      <View style={{ marginTop: 5, gap: 15 }}>
        {(index === 0 || item.date !== transactions[index - 1].date) && (
          <Text>{item.date}</Text>
        )}

        <Row
          style={{
            backgroundColor: Colors.background200,
            padding: 15,
          }}
        >
          <View>
            <Text>{item.type}</Text>
            <Text style={{ color: Colors.text100 }}>
              {item.type === "Send" ? item.to : item.from}
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
        {loading ? (
          <Loader />
        ) : (
          <View>
            {transactions.length > 0 ? (
              <FlatList
                data={transactions}
                nestedScrollEnabled={true}
                renderItem={renderTxn}
                onEndReached={fetchNextPage}
                onEndReachedThreshold={0.3}
                ListFooterComponent={isMore ? <Loader /> : <></>} // Loader when loading next page.
              />
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
