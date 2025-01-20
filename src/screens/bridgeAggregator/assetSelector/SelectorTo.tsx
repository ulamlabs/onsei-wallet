import { useChainById } from "@/modules/mergedBridgeData/useMergedChains";
import { useAggregatorStore } from "@/store/bridgeAggregator";
import { SelectorField } from "./components/SelectorField";
import { fromNormalizedAmount } from "@/utils/decimalUtils";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@/types";

type Props = {
  expectedAmount?: string;
};

export function SelectorTo({ expectedAmount }: Props) {
  const navigation = useNavigation<NavigationProp>();

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
        store.setDirection("TO");
        navigation.navigate("BridgeAssets");
      }}
    />
  );
}
