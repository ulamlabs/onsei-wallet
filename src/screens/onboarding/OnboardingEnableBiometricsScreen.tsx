import {
  Biometrics,
  Column,
  PrimaryButton,
  SafeLayoutBottom,
  TertiaryButton,
} from "@/components";
import { useModalStore, useSettingsStore } from "@/store";
import { NavigatorParamsList } from "@/types";
import { resetNavigationStack } from "@/utils";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { EmojiHappy } from "iconsax-react-native";
import { useEffect, useState } from "react";

type OnboardingEnableBiometricsScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Enable Biometrics"
>;

export function OnboardingEnableBiometricsScreen({
  navigation,
}: OnboardingEnableBiometricsScreenProps) {
  const [enablingBiometrics, setEnablingBiometrics] = useState(false);

  const { setSetting } = useSettingsStore();
  const { alert } = useModalStore();

  useEffect(() => {
    resetNavigationStack(navigation);
  }, [navigation]);

  function enableBiometrics() {
    setSetting("auth.biometricsEnabled", true);
    navigation.navigate("Finish Onboarding");
  }

  async function onNotEnrolled() {
    await alert({
      title: "Biometrics failed",
      description:
        "Face ID / Touch ID not enabled in the system.\nYou can enable it later in the security settings.",
    });
    navigation.navigate("Finish Onboarding");
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
          onPress={() => navigation.navigate("Finish Onboarding")}
        />
      </Column>
    </SafeLayoutBottom>
  );
}
