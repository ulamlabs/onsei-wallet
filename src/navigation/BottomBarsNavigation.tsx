import Dashboard from "@/screens/WalletOverview/Dashboard";
import Transactions from "@/screens/transactions/Transactions";
import { Colors } from "@/styles";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
  ArrangeHorizontalSquare,
  Global,
  Wallet2,
  FlashCircle,
} from "iconsax-react-native";
import React from "react";
import Bar from "./bar/Bar";
import DApps from "@/screens/dApps/DAppsScreen";
import NFTsGallery from "@/screens/nftsGallery/NFTsGallery";
import { View } from "react-native";
import { useCodes } from "@/modules/nfts/api";

export type BottomTabsParamList = {
  Wallet: undefined;
  DApps: undefined;
  Transactions: { address: string };
  NFTs: undefined;
};

const { Navigator, Screen } =
  createMaterialTopTabNavigator<BottomTabsParamList>();

export default function BottomBarsNavigation() {
  useCodes(); // prefetch codes for nfts gallery

  return (
    <Navigator
      initialRouteName="Wallet"
      tabBar={(props) => <Bar {...props} />}
      tabBarPosition="bottom"
      screenOptions={{
        lazy: true,
        lazyPlaceholder: () => (
          <View style={{ backgroundColor: Colors.background }} />
        ),
      }}
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
        name="DApps"
        component={DApps}
        options={{
          tabBarIcon: ({ focused }) => (
            <Global color={focused ? Colors.text : Colors.text100} />
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
        name="NFTs"
        component={NFTsGallery}
        options={{
          tabBarIcon: ({ focused }) => (
            <FlashCircle color={focused ? Colors.text : Colors.text100} />
          ),
        }}
      />
    </Navigator>
  );
}
