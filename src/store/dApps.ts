import { create } from "zustand";

type DAppsStore = {
  url: string;
  init: () => Promise<void>;
  setUrl: (url: string) => void;
  history: string[];
  setHistory: (history: string[]) => void;
  next: boolean;
  setNext: (next: boolean) => void;
  prev: boolean;
  setPrev: (prev: boolean) => void;
  isFocused: boolean;
  setIsFocused: (focused: boolean) => void;
  tooltipOpen: boolean;
  toggleTooltip: (open?: boolean) => void;
};

export const useDAppsStore = create<DAppsStore>((set) => ({
  url: "",
  tooltipOpen: false,
  init: async () => {
    set(() => ({ url: "http://localhost:5173" }));
  },
  setUrl(url) {
    set(() => ({ url }));
  },
  history: [],
  setHistory: (history) => {
    set(() => ({ history }));
  },
  next: false,
  setNext: (next) => {
    set(() => ({ next }));
  },
  prev: false,
  setPrev: (prev) => {
    set(() => ({ prev }));
  },
  isFocused: false,
  setIsFocused: (focused) => {
    set(() => ({ isFocused: focused }));
  },
  toggleTooltip: (open) => {
    set((state) => ({
      tooltipOpen: open !== undefined ? open : !state.tooltipOpen,
    }));
  },
}));
