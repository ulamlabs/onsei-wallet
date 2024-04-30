import { PinWithTimeout } from "@/components";
import { useAuthStore } from "@/store";
import { useRef } from "react";

export default function UnlockScreen() {
  const authStore = useAuthStore();

  const pinHash = useRef(authStore.getPinHash());

  if (!pinHash.current) {
    authStore.unlock();
    return <></>;
  }

  return (
    <PinWithTimeout
      label="Enter your PIN"
      compareToHash={pinHash.current}
      onPinHash={() => authStore.unlock()}
    />
  );
}
