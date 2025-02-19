import { EmptyList, Paragraph, SafeLayout } from "@/components";
import { useTransactions } from "@/modules/transactions";
import DashboardHeader from "@/navigation/header/DashboardHeader";
import DefaultHeaderTitle from "@/navigation/header/DefaultHeaderTitle";
import { useAccountsStore, useTokensStore } from "@/store";
import { View } from "react-native";
import TransactionList from "./TransactionList";
import CenteredLoader from "@/components/CenteredLoader";

export default function Transactions() {
  const { activeAccount } = useAccountsStore();
  const transactions = useTransactions(activeAccount?.address);
  const { updateBalances } = useTokensStore();

  async function refreshApp() {
    await Promise.all([transactions.refetch(), updateBalances()]);
  }

  return (
    <>
      <DashboardHeader>
        <DefaultHeaderTitle title="Transactions" />
      </DashboardHeader>
      <SafeLayout style={{ paddingBottom: 80 }} refreshFn={refreshApp}>
        <View>
          {transactions.isLoading && <CenteredLoader size="big" />}
          {transactions.isError && <Paragraph>Something went wrong</Paragraph>}
          {transactions.isSuccess && transactions.data.length > 0 && (
            <TransactionList transactions={transactions.data} />
          )}
          {transactions.isSuccess && transactions.data.length === 0 && (
            <View style={{ height: "100%" }}>
              <EmptyList title="No transactions found" />
            </View>
          )}
        </View>
      </SafeLayout>
    </>
  );
}
