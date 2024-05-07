import { loadFromStorage, removeFromStorage, saveToStorage } from "@/utils";
import { create } from "zustand";

const SETTINGS_KEY = "settings.json";

const DEFAULT_SETTINGS = {
  "auth.biometricsEnabled": false,
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
    const settings = await loadFromStorage<Settings>(SETTINGS_KEY, {
      ...DEFAULT_SETTINGS,
    });
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
