import { create } from "zustand";

type DAppsStore = {
  url: string;
  init: () => Promise<void>;
  setUrl: (url: string) => void;
};

export const useDAppsStore = create<DAppsStore>((set) => ({
  url: "",
  init: async () => {
    set(() => ({ url: "http://localhost:5173" }));
  },
  setUrl(url) {
    set(() => ({ url }));
  },
}));
