import { EmptyList, Loader, Paragraph, SafeLayout } from "@/components";
import { useTransactions } from "@/modules/transactions";
import DashboardHeader from "@/navigation/header/DashboardHeader";
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
    <>
      <DashboardHeader>
        <DefaultHeaderTitle title="Transactions" />
      </DashboardHeader>
      <SafeLayout style={{ paddingBottom: 65 }} refreshFn={refreshApp}>
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
                <View style={{ height: "100%" }}>
                  <EmptyList title="No transactions found" />
                </View>
              )}
            </View>
          )}
        </View>
      </SafeLayout>
    </>
  );
}
