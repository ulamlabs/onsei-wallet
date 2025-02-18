import { Text } from "@/components";
import { MergedAsset, MergedChain } from "@/modules/mergedBridgeData/types";
import { Colors, FontWeights } from "@/styles";
import { ArrowDown2 } from "iconsax-react-native";
import { Pressable, StyleSheet, View } from "react-native";
import { AssetChainIcon } from "./AssetChainIcon";
import {
  chainFontSize,
  chainLineHeight,
  placeholderFontSize,
  placeholderLineHeight,
} from "./const";

type Props = {
  asset?: MergedAsset;
  chain?: MergedChain;
  onPress: () => void;
};

export function SelectorButton({ asset, chain, onPress }: Props) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <AssetChainIcon
        assetIconUri={asset?.assetIconUri}
        chainIconUri={chain?.chainIconUri}
      />
      <Labels assetSymbol={asset?.symbol} chainName={chain?.chainName} />
      <ArrowDown2 color={Colors.text} size={16} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
});

type LabelsProps = { assetSymbol?: string; chainName?: string };

function Labels({ assetSymbol, chainName }: LabelsProps) {
  return (
    <View>
      {assetSymbol ? (
        <Text>{assetSymbol}</Text>
      ) : (
        <Text style={labelsStyles.placeholder}>Select token</Text>
      )}
      <Text style={labelsStyles.chain}>{chainName}</Text>
    </View>
  );
}

const labelsStyles = StyleSheet.create({
  placeholder: {
    fontFamily: FontWeights.bold,
    fontSize: placeholderFontSize,
    lineHeight: placeholderLineHeight,
  },
  chain: {
    color: Colors.text100,
    fontSize: chainFontSize,
    lineHeight: chainLineHeight,
  },
});
