import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { UnlockScreen } from "@/screens/auth";
import ResetAppScreen from "@/screens/settings/ResetAppScreen";
import { navigatorScreenOptions } from "./const";

export type LockParamList = {
  Unlock: undefined;
  "Clear app data": undefined;
};

const { Navigator, Screen } = createNativeStackNavigator<LockParamList>();

export default () => {
  return (
    <Navigator id="lock" screenOptions={navigatorScreenOptions}>
      <Screen
        name="Unlock"
        component={UnlockScreen}
        options={{ headerShown: false }}
      />
      <Screen name="Clear app data" component={ResetAppScreen} />
    </Navigator>
  );
};
