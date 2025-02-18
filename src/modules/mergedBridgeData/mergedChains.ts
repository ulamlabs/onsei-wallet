import { SkipChain } from "@/modules/skipApi/types";
import { SquidChain } from "@/modules/squidApi/types";
import { ChainId, MergedChain } from "./types";

export const mergedChains = (
  skipChains: SkipChain[],
  squidChains: SquidChain[],
) => {
  const result = new Map<ChainId, MergedChain>();

  skipChains.forEach((chain) => {
    result.set(chain.chain_id, {
      chainIconUri: chain.logo_uri,
      chainId: chain.chain_id,
      chainName: chain.chain_name,
      bridges: ["Skip"],
    });
  });

  squidChains.forEach((chain) => {
    const chainId = chain.chainId.toString();
    const foundChain = result.get(chainId);
    if (foundChain) {
      foundChain.bridges.push("Squid");
    } else {
      result.set(chainId, {
        chainIconUri: chain.chainIconURI,
        chainId: chainId,
        chainName: chain.chainName,
        bridges: ["Squid"],
      });
    }
  });

  return result;
};
