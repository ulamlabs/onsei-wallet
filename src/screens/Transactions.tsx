import { Loader, Paragraph, Row, SafeLayout, Text } from "@/components";
import { AccountTransaction, useAccountsStore } from "@/store";
import { Colors } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { trimAddress } from "@/utils/trimAddress";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";

type TransactionsProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Transactions"
>;

type TransactionRenderProps = {
  item: AccountTransaction;
  index: number;
};

const Transactions = ({
  route: {
    params: { address },
  },
}: TransactionsProps) => {
  const [loading, setLoading] = useState(false);
  const { fetchTxns, accounts } = useAccountsStore();
  const transactions = accounts.find(
    (acc) => acc.address === address,
  )?.transactions;

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      await fetchTxns(address);
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

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
        {loading ? (
          <Loader />
        ) : (
          <View>
            {transactions && transactions?.length > 0 ? (
              <FlatList
                data={transactions}
                nestedScrollEnabled={true}
                renderItem={renderTxn}
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
