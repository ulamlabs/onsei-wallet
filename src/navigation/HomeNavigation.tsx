import { SerializedTx } from "@/modules/transactions";
import ConnectWalletScreen from "@/screens/ConnectWallet";
import MnemonicScreen from "@/screens/MnemonicScreen";
import ReceiveAssets from "@/screens/ReceiveAssets";
import AccountSettingsScreen from "@/screens/WalletOverview/AccountSettingsScreen";
import AccountsScreen from "@/screens/WalletOverview/AccountsScreen";
import EditAccountNameScreen from "@/screens/WalletOverview/EditAccountNameScreen";
import LinkAddressesScreen from "@/screens/WalletOverview/LinkAddressesScreen";
import AddOrEditAddress from "@/screens/addressBook/AddOrEditAddress";
import AddressBook, {
  AddressBookNavParams,
} from "@/screens/addressBook/AddressBookScreen";
import AddressDetailsScreen from "@/screens/addressBook/AddressDetailsScreen";
import TransactionsWithAddress from "@/screens/addressBook/TransactionsWithAddress";
import { AuthorizeScreen, BiometricsDisableScreen } from "@/screens/auth";
import PinChangeScreen from "@/screens/auth/PinChangeScreen";
import PinChangeSuccessScreen from "@/screens/auth/PinChangeSuccessScreen";
import PinDisableScreen from "@/screens/auth/PinDisableScreen";
import PinEnableScreen from "@/screens/auth/PinEnableScreen";
import {
  AddWalletScreen,
  ConfirmMnemonicScreen,
  GenerateWalletScreen,
  ImportWalletScreen,
} from "@/screens/newWallet";
import SetWalletNameScreen from "@/screens/newWallet/SetWalletNameScreen";
import ConnectedAppsScreen from "@/screens/settings/ConnectedAppsScreen";
import NodeSettingsScreen from "@/screens/settings/NodeSettingsScreen";
import ResetAppScreen from "@/screens/settings/ResetAppScreen";
import SecuritySettingsScreen from "@/screens/settings/SecuritySettingsScreen";
import SettingsScreen from "@/screens/settings/SettingsScreen";
import { ManageTokensScreen } from "@/screens/tokens";
import { TransactionDetails } from "@/screens/transactions";
import {
  TransferAmountScreen,
  TransferSelectAddressScreen,
  TransferSelectTokenScreen,
  TransferSendingScreen,
  TransferSentScreen,
  TransferSummaryScreen,
} from "@/screens/transfer";
import ScanAddressScreen from "@/screens/transfer/ScanAddressScreen";
import TransactionSettingscreen from "@/screens/transfer/TransactionSettingsScreen";
import { Account, SavedAddress, Wallet } from "@/store";
import { NavigatorParamsList } from "@/types";
import { trimAddress } from "@/utils";
import { DeliverTxResponse, StdFee } from "@cosmjs/stargate";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import BottomBarsNavigation from "./BottomBarsNavigation";
import { navigatorScreenOptions } from "./const";
import AddressBookHeaderOptions from "./header/AddressBookHeader";
import CancelHeaderRight from "./header/CancelHeaderRight";
import DefaultHeaderLeft from "./header/DefaultHeaderLeft";
import DefaultHeaderTitle from "./header/DefaultHeaderTitle";
import { newWalletScreenOptions } from "./header/NewWalletHeader";
import { SettingsHeaderLeft } from "./header/SettingsHeaderLeft";
import SettingsHeaderRight from "./header/SettingsHeaderRight";

export type Recipient = {
  address: string;
  name?: string;
};

export type HomeParamList = {
  Home: undefined;
  "Security and privacy": undefined;
  "Enable Passcode": { nextRoute: keyof NavigatorParamsList };
  "Disable Passcode": undefined;
  "Change Passcode": undefined;
  "Disable Face ID / Touch ID": undefined;
  "Select network": undefined;
  "Clear app data": undefined;
  Authorize: { nextRoute: keyof NavigatorParamsList; nextParams?: any };
  "Your SEI address": undefined;
  "Saved Address": { addressData?: SavedAddress; address?: string } | undefined;
  "Address Details": { addressData: SavedAddress };
  "Address Transactions": { addressData: SavedAddress };
  "Your unique Recovery Phrase": {
    address: string;
    needsConfirmation?: boolean;
  };
  "Add Wallet": undefined;
  "Generate Wallet": { name: string } | undefined;
  "Import Wallet": { name: string } | undefined;
  "Confirm Mnemonic": { wallet: Wallet; name?: string; backup?: boolean };
  Settings: undefined;
  Wallets: undefined;
  "Wallet settings": { address: string };
  "Edit name": { account: Account };
  "Manage Token List": undefined;
  transferSelectAddress: { address: string } | undefined;
  transferSelectToken: { recipient: Recipient };
  transferAmount: {
    tokenId: string;
    recipient: Recipient;
    gas?: number;
  };
  transferSummary: {
    tokenId: string;
    recipient: Recipient;
    intAmount: string;
    memo?: string;
    fee?: StdFee | null;
    evmTransaction?: `0x${string}`;
    evmTxData?: {
      tokenAmount: string;
      privateKey: `0x${string}`;
      pointerContract: `0x${string}`;
    };
    decimalAmount?: string;
  };
  transferSending: {
    tokenId: string;
    recipient: Recipient;
    intAmount: string;
    fee: StdFee;
    memo?: string;
    evmTransaction?: `0x${string}`;
    evmTxData?: {
      tokenAmount: string;
      privateKey: `0x${string}`;
      pointerContract: `0x${string}`;
    };
  };
  transferSent: {
    tx: DeliverTxResponse | { code: number; transactionHash: `0x${string}` };
    amount?: string;
    symbol?: string;
  };
  "Set Name": { nextRoute: "Import Wallet" | "Generate Wallet" };
  "Scan QR code": undefined;
  "Transaction settings": { global?: boolean; gas?: number };
  "Pin Change Success": undefined;
  "Transaction details": { transaction: SerializedTx };
  "Connect Wallet": undefined;
  "Connected Apps": undefined;
  "Link Addresses": { address: string };
  "Address Book": AddressBookNavParams;
};

const { Navigator, Screen } = createNativeStackNavigator<HomeParamList>();

export default function HomeNavigation() {
  return (
    <Navigator
      id="home"
      screenOptions={{
        ...navigatorScreenOptions,
        headerTitle: (props) => <DefaultHeaderTitle title={props.children} />,
        headerLeft: () => <DefaultHeaderLeft />,
      }}
    >
      <Screen
        name="Home"
        component={BottomBarsNavigation}
        options={{ headerShown: false }}
      />
      <Screen name="Security and privacy" component={SecuritySettingsScreen} />
      <Screen
        name="Clear app data"
        component={ResetAppScreen}
        options={{ title: "", headerBackVisible: false }}
      />
      <Screen
        name="Enable Passcode"
        component={PinEnableScreen}
        options={{ title: "" }}
      />
      <Screen name="Disable Passcode" component={PinDisableScreen} />
      <Screen name="Change Passcode" component={PinChangeScreen} />
      <Screen
        name="Pin Change Success"
        component={PinChangeSuccessScreen}
        options={{ headerShown: false }}
      />
      <Screen
        name="Disable Face ID / Touch ID"
        component={BiometricsDisableScreen}
      />
      <Screen name="Select network" component={NodeSettingsScreen} />
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
      <Screen
        name="Your unique Recovery Phrase"
        options={({
          route: {
            params: { needsConfirmation },
          },
        }) => (needsConfirmation ? newWalletScreenOptions({ step: 1 }) : {})}
        component={MnemonicScreen}
      />
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
      <Screen
        name="Settings"
        options={{
          headerLeft: () => <SettingsHeaderLeft />,
        }}
        component={SettingsScreen}
      />
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
          headerRight: () => SettingsHeaderRight(route.params.gas || 0),
        })}
      />
      <Screen
        name="Transaction settings"
        component={TransactionSettingscreen}
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
      <Screen name="Transaction details" component={TransactionDetails} />
      <Screen name="Connect Wallet" component={ConnectWalletScreen} />
      <Screen name="Connected Apps" component={ConnectedAppsScreen} />
      <Screen name="Link Addresses" component={LinkAddressesScreen} />
      <Screen
        name="Address Book"
        component={AddressBook}
        options={({ route }) => AddressBookHeaderOptions(route, "Address Book")}
      />
    </Navigator>
  );
}
