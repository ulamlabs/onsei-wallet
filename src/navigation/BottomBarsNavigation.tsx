import WalletOverview from "@/screens/WalletOverview/WalletOverview";
import AddressBook from "@/screens/addressBook/AddressBookScreen";
import { Book1, Wallet2 } from "iconsax-react-native";
import React from "react";
import { createBarNavigation } from "./bar";

export type BottomTabsParamList = {
  Wallet: undefined;
  "Address Book": undefined;
};

const { Navigator, Screen } = createBarNavigation<BottomTabsParamList>();

export default function BottomBarsNavigation() {
  return (
    <Navigator>
      <Screen
        name="Wallet"
        component={WalletOverview}
        options={{ icon: Wallet2, headerShown: false }}
      />
      <Screen
        name="Address Book"
        component={AddressBook}
        options={{ icon: Book1 }}
      />
    </Navigator>
  );
}
