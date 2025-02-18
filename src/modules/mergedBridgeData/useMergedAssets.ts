import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { getFungibleAssets } from "@/modules/skipApi/getFungibleAssets";
import { getTokens as getSquidTokens } from "@/modules/squidApi/getTokens";
import { LONG_STALE_TIME } from "@/modules/query/consts";
import { mergedAssets } from "./mergedAssets";
import { AssetId, ChainId, MergedAsset } from "./types";
import { getTokens as getSymbiosisTokens } from "@/modules/symbiosisApi/getTokens";

export const useMergedAssets = () =>
  useQuery<Map<ChainId, Map<AssetId, MergedAsset>>, AxiosError>({
    queryKey: ["merged-assets"] as const,
    queryFn: async () => {
      const squidRequest = getSquidTokens();
      const skipRequest = getFungibleAssets();
      const symbiosisRequest = getSymbiosisTokens();
      const [squidResponse, skipResponse, symbiosisResponse] =
        await Promise.all([squidRequest, skipRequest, symbiosisRequest]);

      return mergedAssets(
        skipResponse.data.chain_to_assets_map,
        squidResponse.data.tokens,
        symbiosisResponse.data,
      );
    },
    retry: false,
    staleTime: LONG_STALE_TIME,
  });
