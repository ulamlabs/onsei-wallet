import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { UnlockScreen } from "@/screens/auth";
import ResetAppScreen from "@/screens/settings/ResetAppScreen";
import tw from "@/lib/tailwind";

export type LockParamList = {
  Unlock: undefined;
  "Clear app data": undefined;
};

const { Navigator, Screen } = createNativeStackNavigator<LockParamList>();

export default () => {
  return (
    <NavigationContainer>
      <Navigator
        screenOptions={{
          headerStyle: { backgroundColor: tw.color("header-background") },
          headerTintColor: "white",
        }}
      >
        <Screen
          name="Unlock"
          component={UnlockScreen}
          options={{ headerShown: false }}
        />
        <Screen name="Clear app data" component={ResetAppScreen} />
      </Navigator>
    </NavigationContainer>
  );
};
