import { useAuthStore, useModalStore, useSettingsStore } from "@/store";
import { Biometrics, SafeLayout, OptionGroup } from "@/components";
import { useMemo, useState } from "react";
import { Link, SwitchWithLabel } from "@/components";
import { Strongbox, Strongbox2, EmojiHappy } from "iconsax-react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { NavigatorParamsList } from "@/types";
import { View } from "react-native";

type SecuritySettingsScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Security"
>;

export default function SecuritySettingsScreen({
  navigation,
}: SecuritySettingsScreenProps) {
  const [enablingBiometrics, setEnablingBiometrics] = useState(false);
  const authStore = useAuthStore();
  const { settings, setSetting } = useSettingsStore();
  const { alert } = useModalStore();

  const pinEnabled = useMemo(() => authStore.state !== "noPin", [authStore]);

  function onEnablePinChange(pinEnabled: boolean) {
    if (pinEnabled) {
      navigation.navigate("Enable Passcode", { nextRoute: "Security" });
    } else {
      navigation.navigate("Disable Passcode");
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

  function onBiometricsNotEnrolled() {
    setEnablingBiometrics(false);
    alert({
      title: "Biometrics failed",
      description: "Face ID / Touch ID not enabled in the system.",
    });
  }

  return (
    <SafeLayout>
      <OptionGroup>
        <SwitchWithLabel
          label="Enable passcode code"
          icon={<Strongbox color="white" />}
          onValueChange={onEnablePinChange}
          value={pinEnabled}
        />
        <Link
          icon={<Strongbox2 color="white" />}
          label="Change passcode code"
          navigateTo="Change Passcode"
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
              onNotEnrolled={onBiometricsNotEnrolled}
            />
          )}
        </View>
      </OptionGroup>
    </SafeLayout>
  );
}
