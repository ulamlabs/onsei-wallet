import { Biometrics, Pin } from "@/components";
import { PIN_LENGTH } from "@/components/pin/const";
import { addSkipButton } from "@/navigation/header/NewWalletHeader";
import { useAuthStore, useModalStore, useSettingsStore } from "@/store";
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
  const { setSetting } = useSettingsStore();
  const [enablingBiometrics, setEnablingBiometrics] = useState(false);

  const { alert } = useModalStore();
  const authStore = useAuthStore();

  useEffect(() => {
    if (route.params.isOnboarding) {
      addSkipButton(navigation, goNextRoute);
    }
  }, []);

  function goNextRoute() {
    if (route.params.isOnboarding) {
      navigation.replace(route.params.nextRoute as any, undefined as any);
      return;
    }
    navigation.navigate(route.params.nextRoute as any, undefined as any);
  }

  function enableBiometrics() {
    setSetting("auth.biometricsEnabled", true);
    goNextRoute();
  }

  async function onNotEnrolled() {
    await alert({
      title: "Biometrics failed",
      description:
        "Face ID / Touch ID not enabled in the system.\nYou can enable it later in the security settings.",
    });
    goNextRoute();
  }

  function savePin(pinHash: string) {
    authStore.setPinHash(pinHash);
    if (route.params.isOnboarding) {
      setEnablingBiometrics(true);
      return;
    }
    goNextRoute();
  }

  return (
    <>
      {enablingBiometrics && (
        <Biometrics
          onSuccess={enableBiometrics}
          onNotEnrolled={onNotEnrolled}
          onCancel={goNextRoute}
        />
      )}
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
