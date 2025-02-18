import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { getInfoChains } from "@/modules/skipApi/getInfoChains";
import { getChains as getSquidChains } from "@/modules/squidApi/getChains";
import { getChains } from "@/modules/symbiosisApi/getChains";
import { LONG_STALE_TIME } from "@/modules/query/consts";
import { useMemo } from "react";
import { mergedChains } from "./mergedChains";
import { ChainId, MergedChain } from "./types";

export const useMergedChains = () =>
  useQuery<Map<ChainId, MergedChain>, AxiosError>({
    queryKey: ["merged-chains"],
    queryFn: async () => {
      const skipRequest = getInfoChains();
      const squidRequest = getSquidChains();
      const symbiosisRequest = getChains();
      const [skipResponse, squidResponse, symbiosisResponse] =
        await Promise.all([skipRequest, squidRequest, symbiosisRequest]);
      return mergedChains(
        skipResponse.data.chains,
        squidResponse.data.chains,
        symbiosisResponse.data,
      );
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
