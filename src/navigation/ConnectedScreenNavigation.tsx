import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomBarsNavigation from "./BottomBarsNavigation";

export type ConnectedStackParamList = {
  Home: undefined;
};

const { Navigator, Screen } =
  createNativeStackNavigator<ConnectedStackParamList>();

export default () => {
  return (
    <Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
      <Screen name="Home" component={BottomBarsNavigation} />
    </Navigator>
  );
};
