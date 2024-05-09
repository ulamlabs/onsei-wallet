import React from "react";
import WalletOverview from "@/screens/WalletOverview";
import AddressBook from "@/screens/addressBook/AddressBookScreen";
import { Book1, Setting2, Wallet2 } from "iconsax-react-native";
import SettingsScreen from "@/screens/settings/SettingsScreen";
import { createBarNavigation } from "./bar";

export type BottomTabsParamList = {
  Wallet: undefined;
  "Address Book": undefined;
  Settings: undefined;
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
      <Screen
        name="Settings"
        component={SettingsScreen}
        options={{ icon: Setting2 }}
      />
    </Navigator>
  );
}
