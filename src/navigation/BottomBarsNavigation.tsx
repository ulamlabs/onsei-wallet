import DashboardHeader from "@/navigation/header/DashboardHeader";
import Transactions from "@/screens/transactions/Transactions";
import Dashboard from "@/screens/WalletOverview/Dashboard";
import AddressBook from "@/screens/addressBook/AddressBookScreen";
import { ArrangeHorizontalSquare, Book, Wallet2 } from "iconsax-react-native";
import React from "react";
import { createBarNavigation } from "./bar";

export type BottomTabsParamList = {
  Wallet: undefined;
  "Address Book": undefined;
  Transactions: { address: string };
};

const { Navigator, Screen } = createBarNavigation<BottomTabsParamList>();

export default function BottomBarsNavigation() {
  return (
    <Navigator>
      <Screen
        name="Wallet"
        component={Dashboard}
        options={{ icon: Wallet2, headerTitle: DashboardHeader }}
      />
      <Screen
        name="Transactions"
        component={Transactions}
        options={{ icon: ArrangeHorizontalSquare }}
      />
      <Screen
        name="Address Book"
        component={AddressBook}
        options={{ icon: Book }}
      />
    </Navigator>
  );
}
