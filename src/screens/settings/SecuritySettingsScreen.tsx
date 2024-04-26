import { useAuthStore } from "@/store";
import { SafeLayout } from "@/components";
import { useMemo } from "react";
import { Link, SwitchWithLabel } from "@/components";
import { Strongbox, Strongbox2 } from "iconsax-react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { NavigatorParamsList } from "@/types";

type SecuritySettingsScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Security"
>;

export function SecuritySettingsScreen({
  navigation,
}: SecuritySettingsScreenProps) {
  const authStore = useAuthStore();

  const pinEnabled = useMemo(() => authStore.state !== "noPin", [authStore]);

  function onEnablePinChange(pinEnabled: boolean) {
    if (pinEnabled) {
      navigation.navigate("Enable PIN", { nextRoute: "Security" });
    } else {
      navigation.navigate("Disable PIN");
    }
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
    </SafeLayout>
  );
}
