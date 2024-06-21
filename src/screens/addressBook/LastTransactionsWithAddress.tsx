import { Column, TertiaryButton, Text } from "@/components";
import { Transaction, useTransactions } from "@/modules/transactions";
import { SavedAddress, useAccountsStore } from "@/store";
import { Colors, FontSizes, FontWeights } from "@/styles";
import { NavigationProp } from "@/types";
import { useNavigation } from "@react-navigation/native";
import { WalletSearch } from "iconsax-react-native";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { TransactionList } from "../transactions";

type Props = { addressData: SavedAddress };

export default function LastTransactionsWithAddress({ addressData }: Props) {
  const navigation = useNavigation<NavigationProp>();
  const { activeAccount } = useAccountsStore();
  const { data: transactions } = useTransactions(activeAccount!.address);
  const [txnWithAddress, setTxnWithAddress] = useState<Transaction[]>([]);

  useEffect(() => {
    const filteredTxns =
      transactions?.filter(
        (t) => t.from === addressData.address || t.to === addressData.address,
      ) || [];
    setTxnWithAddress(filteredTxns);
  }, [transactions]);

  return (
    <View style={{ marginTop: 52 }}>
      <Text style={{ color: Colors.text100, fontSize: FontSizes.base }}>
        Last transactions
      </Text>
      {txnWithAddress.length > 0 ? (
        <Column>
          <TransactionList transactions={txnWithAddress.slice(0, 3)} />
          {txnWithAddress.length > 3 && (
            <TertiaryButton
              title="View all"
              color={Colors.text100}
              textStyle={{ fontFamily: FontWeights.bold }}
              onPress={() =>
                navigation.navigate("Address Transactions", { addressData })
              }
            />
          )}
        </Column>
      ) : (
        <Column style={{ paddingVertical: 60, alignItems: "center" }}>
          <WalletSearch size={90} color={Colors.text400} />
          <Text
            style={{
              color: Colors.text400,
              fontFamily: FontWeights.bold,
              fontSize: FontSizes.lg,
            }}
          >
            No transactions
          </Text>
          <Text style={{ color: Colors.text400 }}>
            You haven't made any transactions with this address yet.
          </Text>
        </Column>
      )}
    </View>
  );
}
