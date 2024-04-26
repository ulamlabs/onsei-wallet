import { create } from "zustand";
import { Account } from "./account";

type OnboardingState = "notReady" | "onboarding" | "finished";

type OnboardingStore = {
  state: OnboardingState;
  init: (accounts: Account[]) => void;
  finishOnboarding: () => void;
};

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  state: "notReady",
  init: (accounts) => {
    set({ state: accounts.length === 0 ? "onboarding" : "finished" });
  },
  finishOnboarding: () => {
    set({ state: "finished" });
  },
}));
