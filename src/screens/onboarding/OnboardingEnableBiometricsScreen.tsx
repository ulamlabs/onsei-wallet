import { Biometrics, Button, SafeLayout } from "@/components";
import { useSettingsStore } from "@/store";
import { NavigatorParamsList } from "@/types";
import { resetNavigationStack } from "@/utils";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { EmojiHappy } from "iconsax-react-native";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

type OnboardingEnableBiometricsScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Enable Biometrics"
>;

export function OnboardingEnableBiometricsScreen({
  navigation,
}: OnboardingEnableBiometricsScreenProps) {
  const [enablingBiometrics, setEnablingBiometrics] = useState(false);
  const [biometricsNotEnrolled, setBiometricsNotEnrolled] = useState(false);

  const { setSetting } = useSettingsStore();

  useEffect(() => {
    resetNavigationStack(navigation);
  }, [navigation]);

  function enableBiometrics() {
    setSetting("auth.biometricsEnabled", true);
    navigation.navigate("Finish Onboarding");
  }

  return (
    <SafeLayout>
      <View style={{ gap: 20 }}>
        <Button
          label="Enable Biometrics"
          onPress={() => setEnablingBiometrics(true)}
          icon={<EmojiHappy color="white" />}
          styles={{ justifyContent: "center" }}
        />

        {enablingBiometrics && (
          <Biometrics
            onSuccess={enableBiometrics}
            onNotEnrolled={() => setBiometricsNotEnrolled(true)}
          />
        )}

        {biometricsNotEnrolled && (
          <Text style={{ color: "red" }}>
            Face ID / Touch ID not enabled in the system.
          </Text>
        )}

        <Button
          label="Skip biometrics protection"
          styles={{ justifyContent: "center", backgroundColor: "transparent" }}
          textStyles={`font-normal`}
          onPress={() => navigation.push("Finish Onboarding")}
        />
      </View>
    </SafeLayout>
  );
}
