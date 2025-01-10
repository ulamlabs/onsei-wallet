import { MergedAsset } from "@/modules/mergedBridgeData/types";
import { useChainById } from "@/modules/mergedBridgeData/useMergedChains";
import { useAggregatorStore } from "@/store/bridgeAggregator";
import { SelectorField } from "./components/SelectorField";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@/types";

type Props = {
  onAmountChange: (value: string) => void;
  onAssetSelect: (value: MergedAsset) => void;
};

export function SelectorFrom({ onAmountChange, onAssetSelect }: Props) {
  const navigation = useNavigation<NavigationProp>();

  const store = useAggregatorStore();

  const asset = store.fromAsset;
  const chain = useChainById(store.fromChain);

  return (
    <SelectorField
      asset={asset}
      chain={chain}
      label={"From"}
      amount={store.amount}
      amountInputId="amount-input"
      onAmountChange={onAmountChange}
      onSelectorOpen={() => {
        store.setDirection("FROM");
        navigation.navigate("BridgeAssets");
      }}
    />
  );
}
