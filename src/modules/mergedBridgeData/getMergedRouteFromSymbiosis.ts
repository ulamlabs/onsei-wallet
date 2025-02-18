import { MergedRoute, RouteParams } from "./types";
import {
  postSwap,
  SymbiosisSwapPayload,
  SymbiosisSwapResponse,
} from "@/modules/symbiosisApi/postSwap";

export const getMergedRouteFromSymbiosis = async ({
  amount,
  fromAsset,
  fromChain,
  toAsset,
  toChain,
}: RouteParams): Promise<MergedRoute> => {
  if (
    !fromAsset.bridges.includes("Symbiosis") ||
    !toAsset.bridges.includes("Symbiosis")
  ) {
    throw new Error("Asset pair not supported by Symbiosis.");
  }

  const payload: SymbiosisSwapPayload = {
    tokenAmountIn: {
      address: "",
      amount: amount,
      chainId: +toChain,
      decimals: toAsset.decimals,
    },
    tokenOut: {
      chainId: +fromChain,
      address: fromAsset.squidAddress || "",
      symbol: fromAsset.symbol,
      decimals: fromAsset.decimals,
    },
    from: "0x0000000000000000000000000000000000000000", // dummy address
    to: "0x0000000000000000000000000000000000000000",
    slippage: 3, // TODO: should be different or configurable?
    selectMode: "best_return",
  };

  const response = await postSwap(payload);
  return buildMergedRouteFromSymbiosis(response.data);
};

const buildMergedRouteFromSymbiosis = (
  route: SymbiosisSwapResponse,
): MergedRoute => {
  return {
    bridge: "Symbiosis",
    expectedReceive: route.tokenAmountOut.amount,
    expectedReceiveUsd: route.amountInUsd.amount,
    expectedTime: route.estimatedTime,
    minReceive: route.tokenAmountOutMin.amount,
  };
};
