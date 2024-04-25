import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomBarsNavigation from "./BottomBarsNavigation";
import { SecuritySettingsScreen } from "@/screens/settings/SecuritySettingsScreen";
import tw from "@/lib/tailwind";
import PinEnableScreen from "@/screens/auth/PinEnableScreen";
import PinDisableScreen from "@/screens/auth/PinDisableScreen";
import PinChangeScreen from "@/screens/auth/PinChangeScreen";
import ResetAppScreen from "@/screens/settings/ResetAppScreen";
import { NavigatorParamsList } from "@/types";
import { AuthorizeScreen } from "@/screens/auth";

export type ConnectedStackParamList = {
  Home: undefined;
  Security: undefined;
  "Enable PIN": { nextRoute: keyof NavigatorParamsList };
  "Disable PIN": undefined;
  "Change PIN": undefined;
  "Clear app data": undefined;
  Authorize: { nextRoute: keyof NavigatorParamsList; nextParams?: any };
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
    </Navigator>
  );
};
