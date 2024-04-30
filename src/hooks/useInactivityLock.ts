import { useEffect, useState } from "react";
import { useAppIsActive } from "./useAppIsActive";
import { useAuthStore } from "@/store";
import { AUTH_INACTIVITY_LOCK_TIMEOUT } from "@/const";

function now() {
  return new Date().getTime() / 1000;
}

export function useInactivityLock() {
  const [timestamp, setTimestamp] = useState(now());

  const authStore = useAuthStore();
  const isAppActive = useAppIsActive();

  useEffect(() => {
    if (isAppActive) {
      if (now() - timestamp > AUTH_INACTIVITY_LOCK_TIMEOUT) {
        authStore.lock();
      }
    } else {
      setTimestamp(now());
    }
  }, [isAppActive]);
}
