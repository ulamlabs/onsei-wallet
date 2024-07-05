import {
  Biometrics,
  Column,
  PrimaryButton,
  SafeLayoutBottom,
  TertiaryButton,
} from "@/components";
import { useModalStore, useSettingsStore } from "@/store";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { EmojiHappy } from "iconsax-react-native";
import { useState } from "react";

type OnboardingEnableBiometricsScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Enable Biometrics"
>;

export function OnboardingEnableBiometricsScreen({
  route,
  navigation,
}: OnboardingEnableBiometricsScreenProps) {
  const [enablingBiometrics, setEnablingBiometrics] = useState(false);

  const { setSetting } = useSettingsStore();
  const { alert } = useModalStore();

  function nextRoute() {
    navigation.replace(route.params.nextRoute as any, undefined as any);
  }

  function enableBiometrics() {
    setSetting("auth.biometricsEnabled", true);
    nextRoute();
  }

  async function onNotEnrolled() {
    await alert({
      title: "Biometrics failed",
      description:
        "Face ID / Touch ID not enabled in the system.\nYou can enable it later in the security settings.",
    });
    nextRoute();
  }

  return (
    <SafeLayoutBottom>
      <Column>
        <PrimaryButton
          title="Enable Biometrics"
          onPress={() => setEnablingBiometrics(true)}
          icon={EmojiHappy}
        />

        {enablingBiometrics && (
          <Biometrics
            onSuccess={enableBiometrics}
            onNotEnrolled={onNotEnrolled}
          />
        )}

        <TertiaryButton
          title="Skip biometrics protection"
          onPress={nextRoute}
        />
      </Column>
    </SafeLayoutBottom>
  );
}
