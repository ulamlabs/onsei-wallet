import { computeAuthorizationTimeout, useAuthStore } from "@/store";
import Pin, { PinProps } from "./Pin";
import { useEffect, useState } from "react";
import AuthorizationTimeout from "./AuthorizationTimeout";
import { useInterval } from "@/hooks";

export default ({ onPinHash, ...props }: PinProps) => {
  const authStore = useAuthStore();

  const [seconds, setSeconds] = useState(() =>
    computeAuthorizationTimeout(authStore.fails)
  );

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
};
