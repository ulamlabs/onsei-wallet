import { PinEnableScreen } from "@/screens/auth";
import {
  ConfirmMnemonicScreen,
  GenerateWalletScreen,
  ImportWalletScreen,
} from "@/screens/newWallet";
import OnboardingFinishScreen from "@/screens/onboarding/OnboardingFinishScreen";
import OnboardingWelcomeScreen from "@/screens/onboarding/OnboardingWelcomeScreen";
import { Wallet } from "@/store";
import { NavigatorParamsList } from "@/types";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { navigatorScreenOptions } from "./const";
import { newWalletScreenOptions } from "./header/NewWalletHeader";

export type OnboardingParamList = {
  Welcome: undefined;
  "Generate Wallet": { name: string } | undefined;
  "Import Wallet": { name: string } | undefined;
  "Confirm Mnemonic": { wallet: Wallet };
  "Finish Onboarding": undefined;
  "Enable Passcode": {
    nextRoute: keyof NavigatorParamsList;
    isOnboarding?: boolean;
  };
};

const { Navigator, Screen } = createNativeStackNavigator<OnboardingParamList>();

export default function OnboardingNavigation() {
  return (
    <Navigator id="onboarding" screenOptions={navigatorScreenOptions}>
      <Screen
        name="Welcome"
        component={OnboardingWelcomeScreen}
        options={{ headerShown: false }}
      />
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
      <Screen name="Finish Onboarding" component={OnboardingFinishScreen} />
      <Screen
        name="Enable Passcode"
        component={PinEnableScreen}
        options={{ title: "" }}
      />
    </Navigator>
  );
}
