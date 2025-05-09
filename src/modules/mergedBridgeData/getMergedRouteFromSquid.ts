import { toNormalizedAmount } from "@/utils/decimalUtils";
import {
  SquidRoute,
  SquidRoutePayload,
  getRoute,
} from "@/modules/squidApi/getRoute";
import { MergedRoute, RouteParams } from "./types";

export const getMergedRouteFromSquid = async ({
  amount,
  fromAsset,
  fromChain,
  toAsset,
  toChain,
}: RouteParams): Promise<MergedRoute> => {
  if (
    !fromAsset.bridges.includes("Squid") ||
    !toAsset.bridges.includes("Squid")
  ) {
    throw new Error("Asset pair not supported by Squid.");
  }

  const payload: SquidRoutePayload = {
    enableExpress: true,
    fromAddress: "0x0000000000000000000000000000000000000000", // dummy address
    fromAmount: toNormalizedAmount(amount, fromAsset.decimals),
    fromChain: fromChain,
    fromToken: fromAsset.squidAddress!,
    quoteOnly: true,
    slippage: "3.0", // TODO: should be different or configurable?
    toChain: toChain,
    toToken: toAsset.squidAddress!,
  };

  const response = await getRoute(payload);

  return buildMergedRouteFromSquid(response.data.route);
};

const buildMergedRouteFromSquid = (route: SquidRoute): MergedRoute => {
  return {
    bridge: "Squid",
    expectedReceive: route.estimate.toAmount,
    expectedReceiveUsd: route.estimate.toAmountUSD,
    expectedTime: route.estimate.estimatedRouteDuration,
    minReceive: route.estimate.toAmountMin,
  };
};
