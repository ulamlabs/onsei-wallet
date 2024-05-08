import MnemonicScreen from "@/screens/MnemonicScreen";
import ReceiveAssets from "@/screens/ReceiveAssets";
import SendAssets from "@/screens/SendAssets";
import Transactions from "@/screens/Transactions";
import AddOrEditAddress from "@/screens/addressBook/AddOrEditAddress";
import { AuthorizeScreen, BiometricsDisableScreen } from "@/screens/auth";
import PinChangeScreen from "@/screens/auth/PinChangeScreen";
import PinDisableScreen from "@/screens/auth/PinDisableScreen";
import PinEnableScreen from "@/screens/auth/PinEnableScreen";
import {
  AddWalletScreen,
  ConfirmMnemonicScreen,
  GenerateWalletScreen,
  ImportWalletScreen,
} from "@/screens/newWallet";
import ResetAppScreen from "@/screens/settings/ResetAppScreen";
import SecuritySettingsScreen from "@/screens/settings/SecuritySettingsScreen";
import NodeSettingsScreen from "@/screens/settings/NodeSettingsScreen";
import { SavedAddress, Wallet } from "@/store";
import { NavigatorParamsList } from "@/types";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import BottomBarsNavigation from "./BottomBarsNavigation";
import { navigatorScreenOptions } from "./const";
import { ManageTokensScreen } from "@/screens/account";

export type HomeParamList = {
  Home: undefined;
  Security: undefined;
  "Enable Passcode": { nextRoute: keyof NavigatorParamsList };
  "Disable Passcode": undefined;
  "Change Passcode": undefined;
  "Disable Face ID / Touch ID": undefined;
  "Change Node": undefined;
  "Clear app data": undefined;
  Authorize: { nextRoute: keyof NavigatorParamsList; nextParams?: any };
  Receive: undefined;
  Send: { address?: string };
  Transactions: { address: string };
  "Saved Address": { action: "ADD" | "EDIT"; addressData?: SavedAddress };
  "Your Mnemonic": { address: string };
  "Add Wallet": undefined;
  "Generate Wallet": undefined;
  "Import Wallet": undefined;
  "Confirm Mnemonic": { wallet: Wallet };
  "Manage Token List": undefined;
};

const { Navigator, Screen } = createNativeStackNavigator<HomeParamList>();

export default function HomeNavigation() {
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
      <Screen name="Change Node" component={NodeSettingsScreen} />
      <Screen name="Authorize" component={AuthorizeScreen} />
      <Screen name="Send" component={SendAssets} />
      <Screen name="Receive" component={ReceiveAssets} />
      <Screen name="Saved Address" component={AddOrEditAddress} />
      <Screen name="Transactions" component={Transactions} />
      <Screen name="Your Mnemonic" component={MnemonicScreen} />
      <Screen name="Add Wallet" component={AddWalletScreen} />
      <Screen name="Generate Wallet" component={GenerateWalletScreen} />
      <Screen name="Confirm Mnemonic" component={ConfirmMnemonicScreen} />
      <Screen name="Import Wallet" component={ImportWalletScreen} />
      <Screen name="Manage Token List" component={ManageTokensScreen} />
    </Navigator>
  );
}
