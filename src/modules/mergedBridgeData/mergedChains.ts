import { SkipChain } from "@/modules/skipApi/types";
import { SquidChain } from "@/modules/squidApi/types";
import { ChainId, MergedChain } from "./types";
import { SymbiosisChain } from "@/modules/symbiosisApi/types";

export const mergedChains = (
  skipChains: SkipChain[],
  squidChains: SquidChain[],
  symbiosisChains: SymbiosisChain[],
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

  symbiosisChains.forEach((chain) => {
    const chainId = chain.id.toString();
    const foundChain = result.get(chainId);
    if (foundChain) {
      foundChain.bridges.push("Symbiosis");
    } else {
      result.set(chainId, {
        chainIconUri: chain.icon,
        chainId: chainId,
        chainName: chain.name,
        bridges: ["Symbiosis"],
      });
    }
  });

  return result;
};
