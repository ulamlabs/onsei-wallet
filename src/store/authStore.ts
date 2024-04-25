import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { NavigationProp, NavigatorParamsList } from "@/types";
import {
  AUTH_TIMEOUT_SECONDS,
  AUTH_MAX_ATTEMPTS,
  AUTH_MAX_TIMEOUT_SECONDS,
} from "@/const";
import { loadFromStorage, removeFromStorage, saveToStorage } from "@/utils";

type Fails = {
  attempts: number;
  timestamp: number;
};

type AuthState = "notReady" | "noPin" | "locked" | "unlocked";

type AuthStore = {
  state: AuthState;
  fails: Fails;
  init: () => Promise<void>;
  setPinHash: (pinHash: string) => void;
  getPinHash: () => string | null;
  unlock: () => void;
  authorize: <RouteName extends keyof NavigatorParamsList>(
    navigation: NavigationProp,
    nextRoute: RouteName,
    nextParams: NavigatorParamsList[RouteName]
  ) => void;
  resetPin: () => Promise<void>;
  registerFail: () => void;
  resetFails: () => Promise<void>;
};

const PIN_KEY = "pinHash";
const FAILS_KEY = "fails.json";

const NO_FAILS: Fails = {
  attempts: 0,
  timestamp: 0,
};

export const useAuthStore = create<AuthStore>((set) => ({
  state: "notReady",
  fails: { ...NO_FAILS },
  init: async () => {
    const fails = await loadFromStorage<Fails>(FAILS_KEY, { ...NO_FAILS });
    set({
      state: SecureStore.getItem(PIN_KEY) ? "locked" : "noPin",
      fails,
    });
  },
  setPinHash: (pinHash) => {
    SecureStore.setItem(PIN_KEY, pinHash);
    set({ state: "unlocked" });
  },
  getPinHash: () => {
    return SecureStore.getItem(PIN_KEY);
  },
  unlock: () => {
    set({ state: "unlocked" });
  },
  authorize: (navigation, nextRoute, nextParams) => {
    if (useAuthStore.getState().state === "noPin") {
      navigation.push(nextRoute, nextParams);
    } else {
      navigation.navigate("Authorize", { nextRoute, nextParams });
    }
  },
  resetPin: async () => {
    await Promise.all([
      SecureStore.deleteItemAsync(PIN_KEY),
      removeFromStorage(FAILS_KEY),
    ]);
    set({ state: "noPin", fails: { ...NO_FAILS } });
  },
  registerFail: () => {
    set((state) => {
      const fails: Fails = {
        attempts: state.fails.attempts + 1,
        timestamp: new Date().getTime(),
      };
      saveToStorage(FAILS_KEY, fails);
      return {
        fails,
        state: fails.attempts >= AUTH_MAX_ATTEMPTS ? "locked" : state.state,
      };
    });
  },
  resetFails: async () => {
    await removeFromStorage(FAILS_KEY);
    set({ fails: { ...NO_FAILS } });
  },
}));

function computeTimeoutFromAttempts(attempts: number) {
  if (attempts < AUTH_MAX_ATTEMPTS) {
    return 0;
  }
  return AUTH_TIMEOUT_SECONDS * 2 ** (attempts - AUTH_MAX_ATTEMPTS);
}

function clampTimeout(timeout: number) {
  return Math.round(Math.max(0, Math.min(AUTH_MAX_TIMEOUT_SECONDS, timeout)));
}

export function computeAuthorizationTimeout(fails: Fails): number {
  if (!fails.attempts || !fails.timestamp) {
    return 0;
  }

  const timeout = computeTimeoutFromAttempts(fails.attempts);
  if (!timeout) {
    return 0;
  }

  const elapsedSeconds =
    Math.round(new Date().getTime() - fails.timestamp) / 1000;
  return clampTimeout(timeout - elapsedSeconds);
}
