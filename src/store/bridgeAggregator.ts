import { toLimitedDecimals } from "@/utils/decimalUtils";
import { ChainId, MergedAsset } from "@/modules/mergedBridgeData/types";
import { ethereum, sei } from "@/utils/popularChainIds";
import { create } from "zustand";

export type AggregatorState = {
  amount: string;
  fromAsset?: MergedAsset; // whole object - allows to write simpler code and easily add more logic in store actions
  fromChain?: ChainId; // only chain id - allows to set default id before fetching data from bridge providers
  toAsset?: MergedAsset;
  toChain?: ChainId;
};

type AggregatorActions = {
  setAmount: (amount: string) => AggregatorState;
  setFromAsset: (asset: MergedAsset) => AggregatorState;
  setToAsset: (asset: MergedAsset) => AggregatorState;
  switchDirection: () => AggregatorState;
};

const initialValue: AggregatorState = {
  amount: "0",
  fromChain: ethereum,
  toChain: sei,
};

export const useAggregatorStore = create<AggregatorState & AggregatorActions>()(
  (set, get) => ({
    ...initialValue,
    setAmount: (amount) => {
      set({ amount });
      return get();
    },
    setFromAsset: (fromAsset) => {
      const current = get();

      // limit decimal part of amount to maximal allowed by next fromAsset's decimals parameter
      const amount = toLimitedDecimals(current.amount, fromAsset.decimals);

      const update: Partial<AggregatorState> = {
        amount,
        fromAsset,
        fromChain: fromAsset.chainId,
      };

      // ensure SEI chain is always one of the selected chains
      if (current.toChain === sei && fromAsset.chainId === sei) {
        update.toAsset = undefined;
        update.toChain = ethereum;
      }
      if (current.toChain !== sei && fromAsset.chainId !== sei) {
        update.toAsset = undefined;
        update.toChain = sei;
      }

      // clear other asset if has no common bridge with the selected asset
      const isCompatible = current.toAsset?.bridges
        ? current.toAsset.bridges.some((bridge) =>
            fromAsset.bridges.includes(bridge),
          )
        : true;
      if (!isCompatible) {
        update.toAsset = undefined;
      }

      set(update);
      return get();
    },
    setToAsset: (toAsset) => {
      const current = get();

      const update: Partial<AggregatorState> = {
        toAsset,
        toChain: toAsset.chainId,
      };

      // ensure SEI chain is always one of the selected chains
      if (current.fromChain === sei && toAsset.chainId === sei) {
        update.fromAsset = undefined;
        update.fromChain = ethereum;
      }
      if (current.fromChain !== sei && toAsset.chainId !== sei) {
        update.fromAsset = undefined;
        update.fromChain = sei;
      }

      // clear other asset if has no common bridge with the selected asset
      const isCompatible = current.fromAsset?.bridges
        ? current.fromAsset.bridges.some((bridge) =>
            toAsset.bridges.includes(bridge),
          )
        : true;
      if (!isCompatible) {
        update.fromAsset = undefined;
      }

      set(update);
      return get();
    },
    switchDirection: () => {
      set((prevState) => ({
        fromAsset: prevState.toAsset,
        fromChain: prevState.toChain,
        toAsset: prevState.fromAsset,
        toChain: prevState.fromChain,
      }));
      return get();
    },
  }),
);
