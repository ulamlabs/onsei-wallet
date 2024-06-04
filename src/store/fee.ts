import { create } from "zustand";

type FeeStore = {
  selectedGasPrice: { speed: "low" | "medium" | "high"; multiplier: number };
  setGasPrice: (speed: "low" | "medium" | "high") => void;
};

export const useFeeStore = create<FeeStore>((set) => ({
  selectedGasPrice: { speed: "low", multiplier: 1 },
  setGasPrice: (speed: "low" | "medium" | "high") => {
    let multiplier = 1;
    if (speed === "medium") {
      multiplier = 1.2;
    } else if (speed === "high") {
      multiplier = 1.3;
    }
    set({ selectedGasPrice: { speed, multiplier } });
  },
}));
