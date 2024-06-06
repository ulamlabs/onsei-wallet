import { useAuthStore } from "@/store";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import ProtectedAction from "./ProtectedAction";

type DisablePinScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Disable Passcode"
>;

export default function PinDisableScreen({
  navigation,
}: DisablePinScreenProps) {
  const authStore = useAuthStore();

  async function resetPin() {
    await authStore.resetPin();
    navigation.navigate("Security and privacy");
  }

  return <ProtectedAction action={resetPin} disableBiometrics={true} />;
}
