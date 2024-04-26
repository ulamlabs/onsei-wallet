import React, { useContext, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Wallet } from "@/store";
import {
  AddressBookContext,
  AddressBookContextType,
} from "@/store/addressBook";
import { NavigationContainer } from "@react-navigation/native";
import WelcomeScreen from "@/screens/onboarding/WelcomeScreen";
import NewWallet from "@/screens/onboarding/NewWallet";
import ConfirmMnemonic from "@/screens/onboarding/ConfirmMnemonic";
import ImportWallet from "@/screens/onboarding/ImportWallet";
import FinishOnboardingScreen from "@/screens/onboarding/FinishOnboardingScreen";

export type OnboardingParamList = {
  Welcome: undefined;
  "New Wallet": undefined;
  "Import Wallet": undefined;
  "Confirm Mnemonic": { wallet: Wallet };
  "Finish onboarding": undefined;
};

const { Navigator, Screen } = createNativeStackNavigator<OnboardingParamList>();

export default () => {
  const { initStore: initBookStore } = useContext(
    AddressBookContext
  ) as AddressBookContextType;

  useEffect(() => {
    initBookStore();
  }, []);

  return (
    <NavigationContainer>
      <Navigator screenOptions={{ headerShown: false }}>
        <Screen name="Welcome" component={WelcomeScreen} />
        <Screen name="New Wallet" component={NewWallet} />
        <Screen name="Confirm Mnemonic" component={ConfirmMnemonic} />
        <Screen name="Import Wallet" component={ImportWallet} />
        <Screen name="Finish onboarding" component={FinishOnboardingScreen} />
      </Navigator>
    </NavigationContainer>
  );
};
