import { PinWithTimeout } from "@/components";
import { useAuthStore } from "@/store";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useRef } from "react";

type DisablePinScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Authorize"
>;

export default function AuthorizeScreen({
  route,
  navigation,
}: DisablePinScreenProps) {
  const authStore = useAuthStore();

  const pinHash = useRef(authStore.getPinHash());

  if (!pinHash.current) {
    navigation.goBack();
    return <></>;
  }

  function authorize() {
    navigation.goBack(); // Remove this view from history
    navigation.navigate(route.params.nextRoute, route.params.nextParams);
  }

  return (
    <PinWithTimeout
      label="Enter your PIN"
      compareToHash={pinHash.current}
      onPinHash={authorize}
    />
  );
}
