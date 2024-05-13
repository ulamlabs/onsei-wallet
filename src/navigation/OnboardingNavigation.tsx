import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Wallet } from "@/store";
import {
  ConfirmMnemonicScreen,
  GenerateWalletScreen,
  ImportWalletScreen,
} from "@/screens/newWallet";
import OnboardingWelcomeScreen from "@/screens/onboarding/OnboardingWelcomeScreen";
import OnboardingFinishScreen from "@/screens/onboarding/OnboardingFinishScreen";
import OnboardingProtectionScreen from "@/screens/onboarding/OnboardingProtectionScreen";
import { PinEnableScreen } from "@/screens/auth";
import { navigatorScreenOptions } from "./const";
import { newWalletScreenOptions } from "./header/NewWalletHeader";
import { NavigatorParamsList } from "@/types";
import { OnboardingEnableBiometricsScreen } from "@/screens/onboarding/OnboardingEnableBiometricsScreen";

export type OnboardingParamList = {
  Welcome: undefined;
  "Generate Wallet": undefined;
  "Import Wallet": undefined;
  "Confirm Mnemonic": { wallet: Wallet };
  "Protect Your Wallet": undefined;
  "Enable Biometrics": undefined;
  "Finish Onboarding": undefined;
  "Enable Passcode": { nextRoute: keyof NavigatorParamsList };
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
      <Screen name="Import Wallet" component={ImportWalletScreen} />
      <Screen
        name="Protect Your Wallet"
        component={OnboardingProtectionScreen}
      />
      <Screen
        name="Enable Biometrics"
        component={OnboardingEnableBiometricsScreen}
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
