import { StdFee } from "@cosmjs/stargate";
import { create } from "zustand";

type FeeStore = {
  selectedGasPrice: { speed: "Low" | "Medium" | "High"; multiplier: number };
  gasPrices: { speed: "Low" | "Medium" | "High"; multiplier: number }[];
  setGasPrice: (speed: "Low" | "Medium" | "High") => void;
  fee: null | StdFee;
  gas: number;
  setFee: (fee: StdFee | null) => void;
  setGas: (gas: number) => void;
};

export const useFeeStore = create<FeeStore>((set, get) => ({
  selectedGasPrice: { speed: "Low", multiplier: 1 },
  fee: null,
  gas: 0,
  gasPrices: [
    { speed: "Low", multiplier: 1 },
    { speed: "Medium", multiplier: 1.2 },
    { speed: "High", multiplier: 1.3 },
  ],
  setGasPrice: (speed) => {
    const gasPrices = get().gasPrices;
    set({ selectedGasPrice: gasPrices.find((gp) => gp.speed === speed)! });
  },
  setFee: (fee) => set({ fee }),
  setGas: (gas) => set({ gas }),
}));
