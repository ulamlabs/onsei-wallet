import Dashboard from "@/screens/WalletOverview/Dashboard";
import AddressBook from "@/screens/addressBook/AddressBookScreen";
import Transactions from "@/screens/transactions/Transactions";
import { Colors } from "@/styles";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ArrangeHorizontalSquare, Book, Wallet2 } from "iconsax-react-native";
import React from "react";
import Bar from "./bar/Bar";

export type BottomTabsParamList = {
  Wallet: undefined;
  "Address Book": undefined;
  Transactions: { address: string };
};

const { Navigator, Screen } =
  createMaterialTopTabNavigator<BottomTabsParamList>();

export default function BottomBarsNavigation() {
  return (
    <Navigator
      initialRouteName="Wallet"
      tabBar={(props) => <Bar {...props} />}
      tabBarPosition="bottom"
    >
      <Screen
        name="Wallet"
        component={Dashboard}
        options={{
          tabBarIcon: ({ focused }) => (
            <Wallet2 color={focused ? Colors.text : Colors.text100} />
          ),
        }}
      />
      <Screen
        name="Transactions"
        component={Transactions}
        options={{
          tabBarIcon: ({ focused }) => (
            <ArrangeHorizontalSquare
              color={focused ? Colors.text : Colors.text100}
            />
          ),
        }}
      />
      <Screen
        name="Address Book"
        component={AddressBook}
        options={{
          tabBarIcon: ({ focused }) => (
            <Book color={focused ? Colors.text : Colors.text100} />
          ),
        }}
      />
    </Navigator>
  );
}
