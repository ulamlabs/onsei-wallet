import { SafeLayout } from "@/components";
import React from "react";
import { SelectChainView } from "./assetSelector";

export default function BridgeAggregatorChains() {
  return (
    <SafeLayout>
      <SelectChainView />
    </SafeLayout>
  );
}
