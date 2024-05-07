import { useAuthStore, useSettingsStore } from "@/store";
import { Biometrics, SafeLayout } from "@/components";
import { useMemo, useState } from "react";
import { Link, SwitchWithLabel } from "@/components";
import { Strongbox, Strongbox2, EmojiHappy } from "iconsax-react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { NavigatorParamsList } from "@/types";
import { Text, View } from "react-native";

type SecuritySettingsScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Security"
>;

export default function SecuritySettingsScreen({
  navigation,
}: SecuritySettingsScreenProps) {
  const [enablingBiometrics, setEnablingBiometrics] = useState(false);
  const [biometricsNotEnrolled, setBiometricsNotEnrolled] = useState(false);
  const authStore = useAuthStore();
  const { settings, setSetting } = useSettingsStore();

  const pinEnabled = useMemo(() => authStore.state !== "noPin", [authStore]);

  function onEnablePinChange(pinEnabled: boolean) {
    if (pinEnabled) {
      navigation.navigate("Enable PIN", { nextRoute: "Security" });
    } else {
      navigation.navigate("Disable PIN");
    }
  }

  function toggleBiometrics() {
    if (settings["auth.biometricsEnabled"]) {
      navigation.navigate("Disable Face ID / Touch ID");
    } else {
      setEnablingBiometrics(true);
    }
  }

  function enableBiometrics() {
    setSetting("auth.biometricsEnabled", true);
    setEnablingBiometrics(false);
  }

  return (
    <SafeLayout>
      <SwitchWithLabel
        label="Enable PIN code"
        icon={<Strongbox color="white" />}
        onValueChange={onEnablePinChange}
        value={pinEnabled}
      />
      <Link
        icon={<Strongbox2 color="white" />}
        label="Change PIN code"
        navigateTo="Change PIN"
        disabled={!pinEnabled}
      />
      <View>
        <SwitchWithLabel
          label="Enable Face ID / Touch ID"
          icon={<EmojiHappy color="white" />}
          onValueChange={toggleBiometrics}
          value={pinEnabled && settings["auth.biometricsEnabled"]}
          disabled={!pinEnabled}
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
      </View>
    </SafeLayout>
  );
}
