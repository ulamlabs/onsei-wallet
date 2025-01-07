import { useMutation } from "@tanstack/react-query";
import Decimal from "decimal.js";
import debounce from "lodash/debounce";
import { AggregatorState } from "@/store/bridgeAggregator";
import { useCallback } from "react";
import { getMergedRouteFromSkip } from "./getMergedRouteFromSkip";
import { getMergedRouteFromSquid } from "./getMergedRouteFromSquid";
import { RouteParams } from "./types";

const getMergedRoutes = async (params: RouteParams) => {
  const results = await Promise.allSettled([
    getMergedRouteFromSkip(params),
    getMergedRouteFromSquid(params),
  ]);

  const routes = [];
  if (results[0].status === "fulfilled") {
    routes.push(results[0].value);
  }
  if (results[1].status === "fulfilled") {
    routes.push(results[1].value);
  }
  return routes
    .sort((a, b) =>
      new Decimal(a.expectedReceive).minus(b.expectedReceive).toNumber(),
    )
    .reverse();
};

const mutationKey = ["merged-routes"];

export const useMergedRoutes = () => {
  const mutation = useMutation({
    mutationKey,
    mutationFn: getMergedRoutes,
  });

  const calculateRoutes = useCallback(
    debounce(
      ({ amount, fromAsset, fromChain, toAsset, toChain }: AggregatorState) => {
        mutation.reset();

        if (!amount || !fromAsset || !fromChain || !toAsset || !toChain) {
          return;
        }

        if (new Decimal(amount).eq(0)) {
          return;
        }

        mutation.mutate({ amount, fromAsset, fromChain, toAsset, toChain });
      },
      200,
    ),
    [],
  );

  return { calculateRoutes, mutation };
};
