import {
  Biometrics,
  Column,
  PrimaryButton,
  ResultHeader,
  SafeLayout,
  TertiaryButton,
} from "@/components";
import { useModalStore, useSettingsStore } from "@/store";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
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
    <SafeLayout>
      <Column
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <ResultHeader
          type="Biometrics"
          header="Enable biometric"
          description="Optionally enable biometric security to protect your data and log in conveniently."
        />
      </Column>
      <Column>
        <PrimaryButton
          title="Enable Biometrics"
          onPress={() => setEnablingBiometrics(true)}
        />

        {enablingBiometrics && (
          <Biometrics
            onSuccess={enableBiometrics}
            onNotEnrolled={onNotEnrolled}
          />
        )}

        <TertiaryButton title="Maybe later" onPress={nextRoute} />
      </Column>
    </SafeLayout>
  );
}
