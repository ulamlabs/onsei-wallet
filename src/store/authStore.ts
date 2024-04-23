import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { NavigationProp, NavigatorParamsList } from "@/types";

type AuthState = "noPin" | "locked" | "unlocked";

type AuthStore = {
  state: AuthState;
  setPinHash: (pinHash: string) => void;
  getPinHash: () => string | null;
  unlock: () => void;
  authorize: <RouteName extends keyof NavigatorParamsList>(
    navigation: NavigationProp,
    nextRoute: RouteName,
    nextParams: NavigatorParamsList[RouteName]
  ) => void;
  resetPin: () => Promise<void>;
};

const PIN_KEY = "pinHash";

export const useAuthStore = create<AuthStore>((set) => ({
  state: SecureStore.getItem(PIN_KEY) ? "locked" : "noPin",
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
    await SecureStore.deleteItemAsync(PIN_KEY);
    set({ state: "noPin" });
  },
}));
