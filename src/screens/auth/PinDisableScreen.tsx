import { Pin } from "@/components";
import { ConnectedStackParamList } from "@/navigation/ConnectedScreenNavigation";
import { useAuthStore } from "@/store/authStore";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useRef } from "react";

type DisablePinScreenProps = NativeStackScreenProps<
  ConnectedStackParamList,
  "Disable PIN"
>;

export default ({ navigation }: DisablePinScreenProps) => {
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
    <Pin
      label="Enter your PIN"
      compareToHash={pinHash.current}
      onPinHash={resetPin}
    />
  );
};
