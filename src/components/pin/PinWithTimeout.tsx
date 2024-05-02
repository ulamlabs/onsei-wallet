import { computeAuthorizationTimeout, useAuthStore } from "@/store";
import Pin, { PinProps } from "./Pin";
import { useEffect, useState } from "react";
import AuthorizationTimeout from "./AuthorizationTimeout";
import { useAppIsActive, useInterval } from "@/hooks";

export default function PinWithTimeout({ onPinHash, ...props }: PinProps) {
  const appIsActive = useAppIsActive();
  const authStore = useAuthStore();

  const [seconds, setSeconds] = useState(() =>
    computeAuthorizationTimeout(authStore.fails),
  );

  useEffect(() => {
    if (appIsActive) {
      // Recompute timeout when app is back to active
      setSeconds(computeAuthorizationTimeout(authStore.fails));
    }
  }, [appIsActive]);

  useEffect(() => {
    setSeconds(computeAuthorizationTimeout(authStore.fails));
  }, [authStore.fails]);

  useInterval(() => {
    if (seconds > 0) {
      setSeconds(seconds - 1);
    }
  }, 1000);

  function onSuccess(pinHash: string) {
    authStore.resetFails();
    onPinHash(pinHash);
  }

  function onFail() {
    authStore.registerFail();
  }

  return (
    <>
      {seconds ? (
        <AuthorizationTimeout timeout={seconds} />
      ) : (
        <Pin {...props} onPinHash={onSuccess} onFail={onFail} />
      )}
    </>
  );
}
