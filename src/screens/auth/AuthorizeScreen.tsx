import { Pin } from "@/components";
import { useAuthStore } from "@/store/authStore";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useRef } from "react";

type DisablePinScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Authorize"
>;

export default ({ route, navigation }: DisablePinScreenProps) => {
  const authStore = useAuthStore();

  const pinHash = useRef(authStore.getPinHash());

  if (!pinHash.current) {
    navigation.goBack();
    return <></>;
  }

  function authorize() {
    navigation.navigate(route.params.nextRoute, route.params.nextParams);
  }

  return (
    <Pin
      label="Enter your PIN"
      compareToHash={pinHash.current}
      onPinHash={authorize}
    />
  );
};
