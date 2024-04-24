import React, { useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import InitScreen from "@/screens/InitScreen";
import NewWallet from "@/screens/NewWallet";
import ConfirmMnemonic from "@/screens/ConfirmMnemonic";
import ImportWallet from "@/screens/ImportWallet";
import ConnectedScreenNavigation from "./ConnectedScreenNavigation";
import { useAccountsStore, Wallet } from "@/store";
import {
  AddressBookContext,
  AddressBookContextType,
} from "@/store/addressBook";

export type MainStackParamList = {
  Init: undefined;
  "New Wallet": undefined;
  "Import Wallet": undefined;
  "Confirm Mnemonic": { wallet: Wallet };
  Connected: undefined;
};

const { Navigator, Screen } = createNativeStackNavigator<MainStackParamList>();

export default () => {
  const accountsStore = useAccountsStore();
  const { initStore: initBookStore } = useContext(
    AddressBookContext
  ) as AddressBookContextType;

  useEffect(() => {
    initBookStore();
  }, []);

  return (
    <NavigationContainer>
      <Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={accountsStore.activeAccount ? "Connected" : "Init"}
      >
        <Screen name="Init" component={InitScreen} />
        <Screen name="New Wallet" component={NewWallet} />
        <Screen name="Confirm Mnemonic" component={ConfirmMnemonic} />
        <Screen name="Import Wallet" component={ImportWallet} />
        <Screen name="Connected" component={ConnectedScreenNavigation} />
      </Navigator>
    </NavigationContainer>
  );
};
