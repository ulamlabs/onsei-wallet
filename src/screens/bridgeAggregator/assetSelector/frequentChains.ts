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
