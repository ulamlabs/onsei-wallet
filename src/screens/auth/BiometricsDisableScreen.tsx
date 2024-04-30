import { useSettingsStore } from "@/store";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import ProtectedAction from "./ProtectedAction";

type BiometricsDisableScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Disable Face ID / Touch ID"
>;

export default function BiometricsDisableScreen({
  navigation,
}: BiometricsDisableScreenProps) {
  const { setSetting } = useSettingsStore();

  function disableBiometrics() {
    setSetting("auth.biometricsEnabled", false);
    navigation.navigate("Security");
  }

  return (
    <ProtectedAction action={disableBiometrics} disableBiometrics={true} />
  );
}
