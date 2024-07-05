import { Pin } from "@/components";
import { PIN_LENGTH } from "@/components/pin/const";
import { addSkipButton } from "@/navigation/header/NewWalletHeader";
import { useAuthStore } from "@/store";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";

type EnablePinScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Enable Passcode"
>;

const description = `Set a ${PIN_LENGTH}-digit passcode to secure your wallet on this device. This passcode can’t be used to recover your wallet.`;

export default function PinEnableScreen({
  route,
  navigation,
}: EnablePinScreenProps) {
  const [pinHash, setPinHash] = useState("");
  const authStore = useAuthStore();

  useEffect(() => {
    if (route.params.isOnboarding) {
      addSkipButton(navigation, goNextRoute);
    }
  }, []);

  function goNextRoute() {
    if (route.params.isOnboarding) {
      navigation.replace("Enable Biometrics", {
        nextRoute: route.params.nextRoute,
      });
      return;
    }
    navigation.navigate(route.params.nextRoute as any, undefined as any);
  }

  function savePin(pinHash: string) {
    authStore.setPinHash(pinHash);
    goNextRoute();
  }

  return (
    <>
      {!pinHash ? (
        <Pin
          label="Create passcode"
          description={description}
          onPinHash={setPinHash}
          key="create"
        />
      ) : (
        <Pin
          label="Create passcode"
          description={description}
          extraInfo="Re-type your passcode"
          compareToHash={pinHash}
          onPinHash={savePin}
          key="retype"
        />
      )}
    </>
  );
}
