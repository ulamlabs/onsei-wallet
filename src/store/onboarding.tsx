import { create } from "zustand";

type OnboardingState = "notReady" | "onboarding" | "finished";

type OnboardingStore = {
  state: OnboardingState;
  startOnboarding: () => void;
  finishOnboarding: () => void;
};

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  state: "notReady",
  startOnboarding: () => {
    set({ state: "onboarding" });
  },
  finishOnboarding: () => {
    set({ state: "finished" });
  },
}));
