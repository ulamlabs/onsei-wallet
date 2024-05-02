import { Biometrics, PinWithTimeout } from "@/components";
import { useAuthStore, useSettingsStore } from "@/store";
import { useRef } from "react";

type ProtectedActionProps = {
  action: () => void;
  disableBiometrics?: boolean;
};

export default function ProtectedAction({
  action,
  disableBiometrics,
}: ProtectedActionProps) {
  const authStore = useAuthStore();
  const { settings } = useSettingsStore();

  const pinHash = useRef(authStore.getPinHash());

  if (!pinHash.current) {
    action();
    return <></>;
  }

  return (
    <>
      {!disableBiometrics && settings["auth.biometricsEnabled"] && (
        <Biometrics onSuccess={action} />
      )}
      <PinWithTimeout
        label="Enter your passcode"
        compareToHash={pinHash.current}
        onPinHash={action}
      />
    </>
  );
}
