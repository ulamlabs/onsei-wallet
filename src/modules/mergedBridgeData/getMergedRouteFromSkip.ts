import { toNormalizedAmount } from "@/utils/decimalUtils";
import {
  SkipRoute,
  SkipRoutePayload,
  postFungibleRoute,
} from "@/modules/skipApi/postFungibleRoute";
import { MergedRoute, RouteParams } from "./types";

export const getMergedRouteFromSkip = async ({
  amount,
  fromAsset,
  fromChain,
  toAsset,
  toChain,
}: RouteParams): Promise<MergedRoute> => {
  if (
    !fromAsset.bridges.includes("Skip") ||
    !toAsset.bridges.includes("Skip")
  ) {
    throw new Error("Asset pair not supported by Skip.");
  }

  const payload: SkipRoutePayload = {
    allow_multi_tx: true,
    allow_unsafe: true,
    amount_in: toNormalizedAmount(amount, fromAsset.decimals),
    dest_asset_chain_id: toChain,
    dest_asset_denom: toAsset.skipDenom!,
    experimental_features: ["cctp", "hyperlane"],
    smart_relay: true,
    source_asset_chain_id: fromChain,
    source_asset_denom: fromAsset.skipDenom!,
  };

  const response = await postFungibleRoute(payload);

  return buildMergedRouteFromSkip(response.data);
};

const buildMergedRouteFromSkip = (route: SkipRoute): MergedRoute => {
  return {
    bridge: "Skip",
    expectedReceive: route.amount_out,
    expectedReceiveUsd: route.usd_amount_out,
  };
};
