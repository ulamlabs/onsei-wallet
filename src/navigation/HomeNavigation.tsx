import React, { useContext, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomBarsNavigation from "./BottomBarsNavigation";
import PinEnableScreen from "@/screens/auth/PinEnableScreen";
import PinDisableScreen from "@/screens/auth/PinDisableScreen";
import PinChangeScreen from "@/screens/auth/PinChangeScreen";
import ResetAppScreen from "@/screens/settings/ResetAppScreen";
import { NavigatorParamsList } from "@/types";
import { AuthorizeScreen, BiometricsDisableScreen } from "@/screens/auth";
import {
  AddressBookContext,
  AddressBookContextType,
} from "@/store/addressBook";
import SendAssets from "@/screens/SendAssets";
import ReceiveAssets from "@/screens/ReceiveAssets";
import Transactions from "@/screens/Transactions";
import {
  AddWalletScreen,
  ConfirmMnemonicScreen,
  GenerateWalletScreen,
  ImportWalletScreen,
} from "@/screens/newWallet";
import { Wallet } from "@/store";
import { navigatorScreenOptions } from "./const";
import SecuritySettingsScreen from "@/screens/settings/SecuritySettingsScreen";
import MnemonicScreen from "@/screens/MnemonicScreen";

export type HomeParamList = {
  Home: undefined;
  Security: undefined;
  "Enable Passcode": { nextRoute: keyof NavigatorParamsList };
  "Disable Passcode": undefined;
  "Change Passcode": undefined;
  "Disable Face ID / Touch ID": undefined;
  "Clear app data": undefined;
  Authorize: { nextRoute: keyof NavigatorParamsList; nextParams?: any };
  Receive: undefined;
  Send: undefined;
  Transactions: { address: string };
  "Your Mnemonic": { address: string };
  "Add Wallet": undefined;
  "Generate Wallet": undefined;
  "Import Wallet": undefined;
  "Confirm Mnemonic": { wallet: Wallet };
};

const { Navigator, Screen } = createNativeStackNavigator<HomeParamList>();

export default function HomeNavigation() {
  const { initStore: initBookStore } = useContext(
    AddressBookContext,
  ) as AddressBookContextType;

  useEffect(() => {
    initBookStore();
  }, [initBookStore]);

  return (
    <Navigator id="home" screenOptions={navigatorScreenOptions}>
      <Screen
        name="Home"
        component={BottomBarsNavigation}
        options={{ headerShown: false }}
      />
      <Screen name="Security" component={SecuritySettingsScreen} />
      <Screen name="Clear app data" component={ResetAppScreen} />
      <Screen
        name="Enable Passcode"
        component={PinEnableScreen}
        options={{ title: "" }}
      />
      <Screen name="Disable Passcode" component={PinDisableScreen} />
      <Screen name="Change Passcode" component={PinChangeScreen} />
      <Screen
        name="Disable Face ID / Touch ID"
        component={BiometricsDisableScreen}
      />
      <Screen name="Authorize" component={AuthorizeScreen} />
      <Screen name="Send" component={SendAssets} />
      <Screen name="Receive" component={ReceiveAssets} />
      <Screen name="Transactions" component={Transactions} />
      <Screen name="Your Mnemonic" component={MnemonicScreen} />
      <Screen name="Add Wallet" component={AddWalletScreen} />
      <Screen name="Generate Wallet" component={GenerateWalletScreen} />
      <Screen name="Confirm Mnemonic" component={ConfirmMnemonicScreen} />
      <Screen name="Import Wallet" component={ImportWalletScreen} />
    </Navigator>
  );
}
