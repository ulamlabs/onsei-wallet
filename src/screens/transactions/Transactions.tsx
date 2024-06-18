import { Loader, Paragraph, SafeLayout } from "@/components";
import { useTransactions } from "@/modules/transactions";
import DefaultHeaderTitle from "@/navigation/header/DefaultHeaderTitle";
import { useAccountsStore, useTokensStore } from "@/store";
import { View } from "react-native";
import TransactionList from "./TransactionList";

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

  return (
    <SafeLayout refreshFn={refreshApp}>
      <DefaultHeaderTitle title="Transactions" style={{ marginBottom: 24 }} />
      <View>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Paragraph>Something went wrong</Paragraph>
        ) : (
          <View>
            {transactions && transactions?.length > 0 ? (
              <TransactionList transactions={transactions} />
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
