import {
  Biometrics,
  Column,
  Link,
  Option,
  OptionGroup,
  SafeLayout,
  SwitchWithLabel,
} from "@/components";
import { useAuthStore, useModalStore, useSettingsStore } from "@/store";
import { Colors } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMemo, useState } from "react";
import { Pressable, View } from "react-native";

type SecuritySettingsScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Security and privacy"
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
      navigation.navigate("Enable Passcode", {
        nextRoute: "Security and privacy",
      });
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

  async function onRemove() {
    authStore.authorize(navigation, "Clear app data", undefined);
  }

  return (
    <SafeLayout>
      <Column style={{ gap: 32 }}>
        <OptionGroup>
          <View>
            <SwitchWithLabel
              label="Use biometric authentication"
              onValueChange={toggleBiometrics}
              value={pinEnabled && settings["auth.biometricsEnabled"]}
              disabled={!pinEnabled}
            />
            {enablingBiometrics && (
              <Biometrics
                onSuccess={enableBiometrics}
                onNotEnrolled={onBiometricsNotEnrolled}
                onFail={() => setEnablingBiometrics(false)}
              />
            )}
          </View>
          <SwitchWithLabel
            label="Use PIN"
            onValueChange={onEnablePinChange}
            value={pinEnabled}
          />
          <Link
            label="Change PIN"
            navigateTo="Change Passcode"
            disabled={!pinEnabled}
          />
        </OptionGroup>
        <OptionGroup>
          <Pressable onPress={onRemove}>
            <Option label="Reset app" labelStyle={{ color: Colors.danger }} />
          </Pressable>
        </OptionGroup>
      </Column>
    </SafeLayout>
  );
}
