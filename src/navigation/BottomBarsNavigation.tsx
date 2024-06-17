import DashboardHeader from "@/navigation/header/DashboardHeader";
import Dashboard from "@/screens/WalletOverview/Dashboard";
import AddressBook from "@/screens/addressBook/AddressBookScreen";
import Transactions from "@/screens/transactions/Transactions";
import { ArrangeHorizontalSquare, Book, Wallet2 } from "iconsax-react-native";
import React from "react";
import { createBarNavigation } from "./bar";
import DefaultHeaderTitle from "./header/DefaultHeaderTitle";

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
        options={{
          icon: ArrangeHorizontalSquare,
          headerTitle: () => <DefaultHeaderTitle title="Transactions" />,
        }}
      />
      <Screen
        name="Address Book"
        component={AddressBook}
        options={{
          icon: Book,
          headerTitle: () => <DefaultHeaderTitle title="Address Bookk" />,
        }}
      />
    </Navigator>
  );
}
