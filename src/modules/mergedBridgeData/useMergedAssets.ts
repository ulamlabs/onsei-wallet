import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { getFungibleAssets } from "@/modules/skipApi/getFungibleAssets";
import { getTokens } from "@/modules/squidApi/getTokens";
import { LONG_STALE_TIME } from "@/modules/query/consts";
import { mergedAssets } from "./mergedAssets";
import { AssetId, ChainId, MergedAsset } from "./types";

export const useMergedAssets = () =>
  useQuery<Map<ChainId, Map<AssetId, MergedAsset>>, AxiosError>({
    queryKey: ["merged-assets"] as const,
    queryFn: async () => {
      const squidRequest = getTokens();
      const skipRequest = getFungibleAssets();
      const [squidResponse, skipResponse] = await Promise.all([
        squidRequest,
        skipRequest,
      ]);

      return mergedAssets(
        skipResponse.data.chain_to_assets_map,
        squidResponse.data.tokens,
      );
    },
    retry: false,
    staleTime: LONG_STALE_TIME,
  });
