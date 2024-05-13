import MnemonicScreen from "@/screens/MnemonicScreen";
import ReceiveAssets from "@/screens/ReceiveAssets";
import ScanScreen from "@/screens/Scan/ScanScreen";
import SendAssets from "@/screens/SendAssets";
import Transactions from "@/screens/Transactions";
import AccountSettings from "@/screens/WalletOverview/AccountSettings";
import AccountsScreen from "@/screens/WalletOverview/AccountsScreen";
import EditAccountName from "@/screens/WalletOverview/EditAccountName";
import { ManageTokensScreen } from "@/screens/account";
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
import NodeSettingsScreen from "@/screens/settings/NodeSettingsScreen";
import ResetAppScreen from "@/screens/settings/ResetAppScreen";
import SecuritySettingsScreen from "@/screens/settings/SecuritySettingsScreen";
import SettingsScreen from "@/screens/settings/SettingsScreen";
import { Account, SavedAddress, Wallet } from "@/store";
import { Colors } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import BottomBarsNavigation from "./BottomBarsNavigation";
import { navigatorScreenOptions } from "./const";
import { newWalletScreenOptions } from "./header/NewWalletHeader";

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
  Settings: undefined;
  Accounts: undefined;
  AccountsModal: undefined;
  "Account settings": { address: string };
  "Edit name": { account: Account };
  ScanModal: undefined;
  Scan: undefined;
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
      <Screen
        name="Generate Wallet"
        options={() => newWalletScreenOptions({ step: 1 })}
        component={GenerateWalletScreen}
      />
      <Screen
        name="Confirm Mnemonic"
        options={() => newWalletScreenOptions({ step: 2 })}
        component={ConfirmMnemonicScreen}
      />
      <Screen name="Import Wallet" component={ImportWalletScreen} />
      <Screen name="Settings" component={SettingsScreen} />
      <Screen
        name="Manage Token List"
        component={ManageTokensScreen}
        options={{ presentation: "modal", headerShown: false }}
      />
      <Screen
        name="Accounts"
        component={AccountsScreen}
        options={{ headerShown: false }}
      />
      <Screen
        name="Account settings"
        component={AccountSettings}
        options={{ headerStyle: { backgroundColor: Colors.background100 } }}
      />
      <Screen
        name="Edit name"
        component={EditAccountName}
        options={{ headerStyle: { backgroundColor: Colors.background100 } }}
      />
      <Screen name="Scan" component={ScanScreen} />
    </Navigator>
  );
}
