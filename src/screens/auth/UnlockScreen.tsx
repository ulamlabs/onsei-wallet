import { Pin } from "@/components";
import { useAuthStore } from "@/store/authStore";
import { useRef } from "react";

export default () => {
  const authStore = useAuthStore();

  const pinHash = useRef(authStore.getPinHash());

  if (!pinHash.current) {
    authStore.unlock();
    return <></>;
  }

  return (
    <Pin
      label="Enter your PIN"
      compareToHash={pinHash.current}
      onPinHash={() => authStore.unlock()}
    />
  );
};
