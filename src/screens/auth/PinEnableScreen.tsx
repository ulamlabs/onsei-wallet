import { Pin } from "@/components";
import { useAuthStore } from "@/store/authStore";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";

type EnablePinScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Enable PIN"
>;

export default ({ route, navigation }: EnablePinScreenProps) => {
  const [pinHash, setPinHash] = useState("");

  const authStore = useAuthStore();

  function savePin(pinHash: string) {
    authStore.setPinHash(pinHash);
    navigation.navigate(route.params.nextRoute as any);
  }

  return (
    <>
      {!pinHash ? (
        <Pin label="Setup your PIN" onPinHash={setPinHash} key="setup" />
      ) : (
        <Pin
          label="Confirm your PIN"
          compareToHash={pinHash}
          onPinHash={savePin}
          key="confirm"
        />
      )}
    </>
  );
};
