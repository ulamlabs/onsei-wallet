import { MergedAsset } from "@/modules/mergedBridgeData/types";
import { useChainById } from "@/modules/mergedBridgeData/useMergedChains";
import { useAggregatorStore } from "@/store/bridgeAggregator";
import { SelectorField } from "./components/SelectorField";
import { fromNormalizedAmount } from "@/utils/decimalUtils";

type Props = {
  expectedAmount?: string;
  onAssetSelect: (value: MergedAsset) => void;
};

export function SelectorTo({ expectedAmount, onAssetSelect }: Props) {
  const store = useAggregatorStore();

  const asset = store.toAsset;
  const chain = useChainById(store.toChain);

  return (
    <SelectorField
      amount={
        asset &&
        expectedAmount &&
        fromNormalizedAmount(expectedAmount, asset.decimals)
      }
      asset={asset}
      chain={chain}
      label={"To"}
      onSelectorOpen={() => {
        console.log("to clicked");
      }}
    />
  );
}
