import { ChainId } from "@/modules/mergedBridgeData/types";
import * as popularChainIds from "@/utils/popularChainIds";

export const defaultExtraChain = popularChainIds.arbitrum;

// TODO: make sure the chains are actually available (exist in merged chains data)
export const frequentChains = [
  popularChainIds.sei,
  popularChainIds.ethereum,
  popularChainIds.binance,
  popularChainIds.solana,
  // popularChainIds.polygon,
];

export const getExtraChain = (
  selectedChain?: ChainId,
  currentExtraChain?: ChainId,
) => {
  if (!selectedChain) {
    return defaultExtraChain;
  }
  if (!frequentChains.includes(selectedChain)) {
    return selectedChain;
  }
  return currentExtraChain ?? defaultExtraChain;
};
