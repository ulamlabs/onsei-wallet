import { Column, Loader, Paragraph, Row, SafeLayout, Text } from "@/components";
import { Transaction, useTransactions } from "@/modules/transactions";
import { useAccountsStore, useTokensStore } from "@/store";
import { Colors } from "@/styles";
import { trimAddress } from "@/utils/trimAddress";
import { View } from "react-native";

type TransactionRenderProps = {
  item: Transaction;
  index: number;
};

export default function Transactions() {
  const { activeAccount } = useAccountsStore();
  const {
    data: transactions,
    error,
    isLoading,
    refetch,
  } = useTransactions(activeAccount?.address || "");
  const { updateBalances } = useTokensStore();

  async function refreshApp() {
    await Promise.all([refetch(), updateBalances()]);
  }

  const renderTxn = ({ item, index }: TransactionRenderProps) => {
    return (
      <View key={index} style={{ marginTop: 20, gap: 10 }}>
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
    <SafeLayout refreshFn={refreshApp}>
      <View>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Paragraph>Something went wrong</Paragraph>
        ) : (
          <View>
            {transactions && transactions?.length > 0 ? (
              <Column>
                {transactions.map((item, index) => renderTxn({ item, index }))}
              </Column>
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
}
