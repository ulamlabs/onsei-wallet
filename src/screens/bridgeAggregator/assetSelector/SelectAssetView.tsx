import {
  ChainId,
  MergedAsset,
  MergedChain,
} from "@/modules/mergedBridgeData/types";
import { useMemo, useState } from "react";
import { defaultExtraChain, frequentChains } from "./frequentChains";
import { useAggregatorStore } from "@/store/bridgeAggregator";
import { Pressable, StyleSheet, View } from "react-native";
import { QuickChainSelector } from "./components/QuickChainSelector";
import { useChainById } from "@/modules/mergedBridgeData/useMergedChains";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@/types";
import { useMergedAssets } from "@/modules/mergedBridgeData/useMergedAssets";
import { Text, TextInput } from "@/components";
import { Header } from "./components/Header";
import { SearchNormal } from "iconsax-react-native";
import { AssetChainIcon } from "./components/AssetChainIcon";
import { Colors, FontSizes, FontWeights } from "@/styles";

type Props = {};

export function SelectAssetView({}: Props) {
  const navigation = useNavigation<NavigationProp>();

  const store = useAggregatorStore();

  const currentChainId =
    store.direction === "FROM" ? store.fromChain : store.toChain;

  const [selectedChainId, setSelectedChainId] = useState(currentChainId);
  const [extraChainId, setExtraChainId] = useState(() =>
    getExtraChain(currentChainId),
  );

  const selectedChain = useChainById(selectedChainId);

  const [assetQuery, setAssetQuery] = useState("");

  const { data: assets } = useMergedAssets();

  const optionAssets = useMemo(
    () =>
      Array.from(
        (assets && selectedChainId && assets.get(selectedChainId)) || [],
        ([_, chain]) => chain,
      ),
    [selectedChainId, assets],
  );

  const searchQueryLc = assetQuery.toLowerCase();

  const filteredAssets = assetQuery
    ? optionAssets.filter(
        (asset) =>
          asset.symbol.toLowerCase().includes(searchQueryLc) ||
          asset.name.toLowerCase().includes(searchQueryLc) ||
          asset.skipDenom?.toLowerCase() === searchQueryLc ||
          asset.squidAddress?.toLowerCase() === searchQueryLc,
      )
    : optionAssets;

  return (
    <View style={styles.container}>
      <QuickChainSelector
        extraChainId={extraChainId}
        selectedChain={selectedChain}
        onOpenSelectChain={() => {
          navigation.navigate("BridgeChains");
        }}
        onChainSelect={(value) => {
          setSelectedChainId(value);
        }}
      />
      <View style={styles.assets}>
        <Header>Select token</Header>
        <TextInput
          placeholder="Search token"
          value={assetQuery}
          onChangeText={setAssetQuery}
          showClear
          icon={SearchNormal}
        />
        <View>
          {filteredAssets.map((asset) => (
            <AssetButton
              key={asset.assetId}
              asset={asset}
              chain={selectedChain}
              onPress={() => {
                store.direction === "FROM"
                  ? store.setFromAsset(asset)
                  : store.setToAsset(asset);
                navigation.goBack();
              }}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  assets: {
    gap: 20,
  },
});

const getExtraChain = (
  selectedChain?: ChainId,
  currentExtraChain?: ChainId,
) => {
  if (!selectedChain) {
    return defaultExtraChain;
  }
  if (!frequentChains.includes(selectedChain)) {
    return selectedChain;
  }
  return currentExtraChain ?? defaultExtraChain;
};

type AssetButtonProps = {
  asset?: MergedAsset;
  chain?: MergedChain;
  onPress: () => void;
};

function AssetButton({ asset, chain, onPress }: AssetButtonProps) {
  return (
    <Pressable style={assetButtonStyles.container} onPress={onPress}>
      <AssetChainIcon
        assetIconUri={asset?.assetIconUri}
        chainIconUri={chain?.chainIconUri}
      />
      <View>
        <Text style={assetButtonStyles.assetSymbol}>{asset?.symbol}</Text>
        <Text style={assetButtonStyles.assetName}>{asset?.name}</Text>
      </View>
    </Pressable>
  );
}

const assetButtonStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 8,
    alignItems: "center",
  },
  assetSymbol: {
    color: Colors.text,
    fontFamily: FontWeights.bold,
    fontSize: FontSizes.lg,
    lineHeight: FontSizes.lg * 1.2,
  },
  assetName: {
    color: Colors.text100,
    fontSize: FontSizes.sm,
    lineHeight: FontSizes.sm * 1.5,
  },
});
