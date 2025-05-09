import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { getInfoChains } from "@/modules/skipApi/getInfoChains";
import { getChains } from "@/modules/squidApi/getChains";
import { LONG_STALE_TIME } from "@/modules/query/consts";
import { useMemo } from "react";
import { mergedChains } from "./mergedChains";
import { ChainId, MergedChain } from "./types";

export const useMergedChains = () =>
  useQuery<Map<ChainId, MergedChain>, AxiosError>({
    queryKey: ["merged-chains"],
    queryFn: async () => {
      const skipRequest = getInfoChains();
      const squidRequest = getChains();
      const [skipResponse, squidResponse] = await Promise.all([
        skipRequest,
        squidRequest,
      ]);
      return mergedChains(skipResponse.data.chains, squidResponse.data.chains);
    },
    staleTime: LONG_STALE_TIME,
  });

export const useChainById = (chainId?: string) => {
  const { data: chains } = useMergedChains();
  return chainId && chains ? chains.get(chainId) : undefined;
};

export const useChainList = () => {
  const { data: chains } = useMergedChains();

  return useMemo(
    () => (chains ? Array.from(chains, ([_, chain]) => chain) : []),
    [chains],
  );
};
