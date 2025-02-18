import { SafeLayout } from "@/components";
import React from "react";
import { SelectAssetView } from "./assetSelector";

export default function BridgeAggregatorAssets() {
  return (
    <SafeLayout>
      <SelectAssetView />
    </SafeLayout>
  );
}
