import { useAuthStore } from "@/store/authStore";
import SafeLayout from "@/components/SafeLayout";
import { useMemo } from "react";
import { Link, SwitchWithLabel } from "@/components";
import { Strongbox, Strongbox2 } from "iconsax-react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ConnectedStackParamList } from "@/navigation/ConnectedScreenNavigation";

type SecuritySettingsScreenProps = NativeStackScreenProps<
  ConnectedStackParamList,
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
        navigation={navigation}
        navigateTo="Change PIN"
        disabled={!pinEnabled}
      />
    </SafeLayout>
  );
}
