import tw from "@/lib/tailwind";
import ReceiveAssets from "@/screens/ReceiveAssets";
import SendAssets from "@/screens/SendAssets";
import { AuthorizeScreen } from "@/screens/auth";
import PinChangeScreen from "@/screens/auth/PinChangeScreen";
import PinDisableScreen from "@/screens/auth/PinDisableScreen";
import PinEnableScreen from "@/screens/auth/PinEnableScreen";
import ResetAppScreen from "@/screens/settings/ResetAppScreen";
import { SecuritySettingsScreen } from "@/screens/settings/SecuritySettingsScreen";
import { NavigatorParamsList } from "@/types";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import BottomBarsNavigation from "./BottomBarsNavigation";

export type ConnectedStackParamList = {
  Home: undefined;
  Security: undefined;
  "Enable PIN": { nextRoute: keyof NavigatorParamsList };
  "Disable PIN": undefined;
  "Change PIN": undefined;
  "Clear app data": undefined;
  Authorize: { nextRoute: keyof NavigatorParamsList; nextParams?: any };
  Receive: undefined;
  Send: undefined;
  Transactions: { address: string };
};

const { Navigator, Screen } =
  createNativeStackNavigator<ConnectedStackParamList>();

export default () => {
  return (
    <Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: tw.color("header-background") },
        headerTintColor: "white",
      }}
      initialRouteName="Home"
    >
      <Screen
        name="Home"
        component={BottomBarsNavigation}
        options={{ headerShown: false }}
      />
      <Screen name="Security" component={SecuritySettingsScreen} />
      <Screen name="Clear app data" component={ResetAppScreen} />
      <Screen name="Enable PIN" component={PinEnableScreen} />
      <Screen name="Disable PIN" component={PinDisableScreen} />
      <Screen name="Change PIN" component={PinChangeScreen} />
      <Screen name="Authorize" component={AuthorizeScreen} />
      <Screen name="Send" component={SendAssets} />
      <Screen name="Receive" component={ReceiveAssets} />
      <Screen name="Transactions" component={Transactions} />
    </Navigator>
  );
};
