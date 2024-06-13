import { FeeTier } from "@/components/FeeBox";
import { Node } from "@/types";
import { loadFromStorage, removeFromStorage, saveToStorage } from "@/utils";
import { create } from "zustand";

const SETTINGS_KEY = "settings.json";

const DEFAULT_SETTINGS = {
  "auth.biometricsEnabled": false,
  node: "TestNet" as Node,
  selectedGasPrice: {
    global: "Low" as FeeTier,
    local: "Low" as FeeTier,
  },
  allowNotifications: true,
};

type Settings = typeof DEFAULT_SETTINGS;

type SettingsStore = {
  settings: Settings;
  init: () => Promise<void>;
  setSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  reset: () => Promise<void>;
};

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: { ...DEFAULT_SETTINGS },
  init: async () => {
    const storedSettings = await loadFromStorage<Partial<Settings>>(
      SETTINGS_KEY,
      { ...DEFAULT_SETTINGS },
    );
    const settings = { ...DEFAULT_SETTINGS, ...storedSettings };
    set({ settings });
  },
  setSetting: (key, value) => {
    set((state) => {
      const settings = { ...state.settings, [key]: value };
      saveToStorage(SETTINGS_KEY, settings);
      return { settings };
    });
  },
  reset: async () => {
    await removeFromStorage(SETTINGS_KEY);
    set({ settings: { ...DEFAULT_SETTINGS } });
  },
}));
