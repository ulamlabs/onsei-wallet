import { loadFromStorage, saveToStorage } from "@/utils";
import { create } from "zustand";

type OnboardingState = "notReady" | "onboarding" | "finished";

type OnboardingStore = {
  state: OnboardingState;
  startOnboarding: () => void;
  finishOnboarding: () => void;
  init: () => void;
};

export const useOnboardingStore = create<OnboardingStore>((set, get) => ({
  state: "notReady",
  init: async () => {
    const storedSettings = await loadFromStorage("onboarding", {
      state: get().state,
    });
    set({ state: storedSettings.state });
  },
  startOnboarding: () => {
    set({ state: "onboarding" });
    saveToStorage("onboarding", { state: "onboarding" });
  },
  finishOnboarding: () => {
    set({ state: "finished" });
    saveToStorage("onboarding", { state: "finished" });
  },
}));
