import { useAccountsStore } from "@/store";
import { NavigatorParamsList } from "@/types";
import React, { useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeLayout } from "@/components";
import { Transaction, useTransactions } from "@/modules/transactions";
import { TransactionList } from "../transactions";

type Props = NativeStackScreenProps<
  NavigatorParamsList,
  "Address Transactions"
>;

export default function TransactionsWithAddress({
  route: {
    params: { addressData },
  },
}: Props) {
  const { activeAccount } = useAccountsStore();
  const { data: transactions, refetch } = useTransactions(
    activeAccount!.address,
  );
  const [txnWithAddress, setTxnWithAddress] = useState<Transaction[]>([]);

  useEffect(() => {
    const filteredTxns =
      transactions?.filter(
        (t) => t.from === addressData.address || t.to === addressData.address,
      ) || [];
    setTxnWithAddress(filteredTxns);
  }, [transactions]);

  return (
    <SafeLayout refreshFn={refetch}>
      <TransactionList transactions={txnWithAddress} />
    </SafeLayout>
  );
}
