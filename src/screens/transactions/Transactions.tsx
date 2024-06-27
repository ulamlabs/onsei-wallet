import { Loader, Paragraph, SafeLayout, SplashAnimation } from "@/components";
import { useTransactions } from "@/modules/transactions";
import DashboardHeader from "@/navigation/header/DashboardHeader";
import DefaultHeaderTitle from "@/navigation/header/DefaultHeaderTitle";
import { useAccountsStore, useTokensStore } from "@/store";
import { useState } from "react";
import { Pressable, View } from "react-native";
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
  const [start, setStart] = useState(false);

  async function refreshApp() {
    await Promise.all([refetch(), updateBalances()]);
  }

  return (
    <>
      <DashboardHeader>
        <Pressable onPress={() => setStart(!start)}>
          <DefaultHeaderTitle title="Transactions" />
        </Pressable>
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
                <Paragraph style={{ textAlign: "center" }}>
                  No transactions yet
                </Paragraph>
              )}
            </View>
          )}
        </View>
      </SafeLayout>
      {start && (
        <SplashAnimation
          style={{
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
      )}
    </>
  );
}
