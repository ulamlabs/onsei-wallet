import MnemonicScreen from "@/screens/MnemonicScreen";
import ReceiveAssets from "@/screens/ReceiveAssets";
import AccountSettingsScreen from "@/screens/WalletOverview/AccountSettingsScreen";
import AccountsScreen from "@/screens/WalletOverview/AccountsScreen";
import EditAccountNameScreen from "@/screens/WalletOverview/EditAccountNameScreen";
import { ManageTokensScreen } from "@/screens/account";
import AddOrEditAddress from "@/screens/addressBook/AddOrEditAddress";
import AddressDetailsScreen from "@/screens/addressBook/AddressDetailsScreen";
import TransactionsWithAddress from "@/screens/addressBook/TransactionsWithAddress";
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
import SetWalletNameScreen from "@/screens/newWallet/SetWalletNameScreen";
import NodeSettingsScreen from "@/screens/settings/NodeSettingsScreen";
import ResetAppScreen from "@/screens/settings/ResetAppScreen";
import SecuritySettingsScreen from "@/screens/settings/SecuritySettingsScreen";
import SettingsScreen from "@/screens/settings/SettingsScreen";
import {
  TransferAmountScreen,
  TransferSelectAddressScreen,
  TransferSelectTokenScreen,
  TransferSendingScreen,
  TransferSentScreen,
  TransferSummaryScreen,
} from "@/screens/transfer";
import ScanAddressScreen from "@/screens/transfer/ScanAddressScreen";
import { Account, SavedAddress, Wallet } from "@/store";
import { NavigatorParamsList } from "@/types";
import { trimAddress } from "@/utils";
import { DeliverTxResponse, StdFee } from "@cosmjs/stargate";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import BottomBarsNavigation from "./BottomBarsNavigation";
import { navigatorScreenOptions } from "./const";
import CancelHeaderRight from "./header/CancelHeaderRight";
import { newWalletScreenOptions } from "./header/NewWalletHeader";

export type Recipient = {
  address: string;
  name?: string;
};

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
  "Your SEI address": undefined;
  "Saved Address": { addressData?: SavedAddress; address?: string } | undefined;
  "Address Details": { addressData: SavedAddress };
  "Address Transactions": { addressData: SavedAddress };
  "Your Mnemonic": { address: string };
  "Add Wallet": undefined;
  "Generate Wallet": { name: string } | undefined;
  "Import Wallet": { name: string } | undefined;
  "Confirm Mnemonic": { wallet: Wallet };
  Settings: undefined;
  Wallets: undefined;
  "Wallet settings": { address: string };
  "Edit name": { account: Account };
  "Manage Token List": undefined;
  transferSelectToken: undefined;
  transferSelectAddress: { tokenId: string; address?: string };
  transferAmount: { tokenId: string; recipient: Recipient };
  transferSummary: {
    tokenId: string;
    recipient: Recipient;
    intAmount: string;
    memo?: string;
  };
  transferSending: {
    tokenId: string;
    recipient: Recipient;
    intAmount: string;
    fee: StdFee;
  };
  transferSent: { tx: DeliverTxResponse; amount?: string; symbol?: string };
  "Set Name": { nextRoute: "Import Wallet" | "Generate Wallet" };
  "Scan QR code": { tokenId: string };
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
      <Screen name="Your SEI address" component={ReceiveAssets} />
      <Screen
        name="Saved Address"
        component={AddOrEditAddress}
        options={({ route }) => ({
          title: route.params?.addressData ? "Edit address" : "Add address",
        })}
      />
      <Screen name="Address Details" component={AddressDetailsScreen} />
      <Screen
        name="Address Transactions"
        component={TransactionsWithAddress}
        options={({ route }) => ({
          title: `${route.params.addressData.name}: Transactions`,
        })}
      />
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
      <Screen
        name="Import Wallet"
        component={ImportWalletScreen}
        options={{ title: "" }}
      />
      <Screen name="Settings" component={SettingsScreen} />
      <Screen name="Manage Token List" component={ManageTokensScreen} />
      <Screen name="Wallets" component={AccountsScreen} />
      <Screen name="Wallet settings" component={AccountSettingsScreen} />
      <Screen name="Edit name" component={EditAccountNameScreen} />
      <Screen
        name="transferSelectToken"
        component={TransferSelectTokenScreen}
        options={{ title: "Select token" }}
      />
      <Screen
        name="transferSelectAddress"
        component={TransferSelectAddressScreen}
        options={{ title: "Choose address" }}
      />
      <Screen
        name="transferAmount"
        component={TransferAmountScreen}
        options={({ route }) => ({
          title: `To: ${route.params.recipient.name || ""} (${trimAddress(route.params.recipient.address)})`,
        })}
      />
      <Screen
        name="transferSummary"
        component={TransferSummaryScreen}
        options={() => ({
          title: "Summary",
          headerRight: CancelHeaderRight,
        })}
      />
      <Screen
        name="transferSending"
        component={TransferSendingScreen}
        options={{ headerShown: false }}
      />
      <Screen
        name="transferSent"
        component={TransferSentScreen}
        options={{ headerShown: false }}
      />
      <Screen
        name="Set Name"
        component={SetWalletNameScreen}
        options={({ route }) => ({ title: route.params.nextRoute })}
      />
      <Screen name="Scan QR code" component={ScanAddressScreen} />
    </Navigator>
  );
}
