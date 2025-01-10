import { MergedAsset, MergedChain } from "@/modules/mergedBridgeData/types";
import { useEffect, useMemo, useState } from "react";
import { getExtraChain } from "./utils";
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

export function SelectAssetView() {
  const navigation = useNavigation<NavigationProp>();

  const store = useAggregatorStore();

  const currentChainId =
    store.direction === "FROM" ? store.fromChain : store.toChain;

  useEffect(() => {
    store.setSelectedChainId(currentChainId);
    store.setExtraChainId(getExtraChain(currentChainId));
  }, [currentChainId]);

  const selectedChain = useChainById(store.selectedChainId);

  const [assetQuery, setAssetQuery] = useState("");

  const { data: assets } = useMergedAssets();

  const optionAssets = useMemo(
    () =>
      Array.from(
        (assets &&
          store.selectedChainId &&
          assets.get(store.selectedChainId)) ||
          [],
        ([_, chain]) => chain,
      ),
    [store.selectedChainId, assets],
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
        extraChainId={store.extraChainId!}
        selectedChain={selectedChain}
        onOpenSelectChain={() => {
          navigation.navigate("BridgeChains");
        }}
        onChainSelect={(value) => {
          store.setSelectedChainId(value);
          store.setExtraChainId(getExtraChain(value, store.extraChainId));
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
