import { PinWithTimeout } from "@/components";
import { useAuthStore } from "@/store";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useRef } from "react";

type DisablePinScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Disable PIN"
>;

export default function PinDisableScreen({
  navigation,
}: DisablePinScreenProps) {
  const authStore = useAuthStore();

  const pinHash = useRef(authStore.getPinHash());

  if (!pinHash.current) {
    navigation.goBack();
    return <></>;
  }

  async function resetPin() {
    await authStore.resetPin();
    navigation.navigate("Security");
  }

  return (
    <PinWithTimeout
      label="Enter your PIN"
      compareToHash={pinHash.current}
      onPinHash={resetPin}
    />
  );
}
