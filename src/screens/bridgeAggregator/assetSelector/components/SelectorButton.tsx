import { Text } from "@/components";
import { MergedAsset, MergedChain } from "@/modules/mergedBridgeData/types";
import { Colors, FontSizes, FontWeights } from "@/styles";
import { ArrowDown2 } from "iconsax-react-native";
import { Image, Pressable, StyleSheet, View } from "react-native";

type Props = {
  asset?: MergedAsset;
  chain?: MergedChain;
  onPress: () => void;
};

export function SelectorButton({ asset, chain, onPress }: Props) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Icons
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

type IconsProps = {
  assetIconUri?: string;
  chainIconUri?: string;
};

function Icons({ assetIconUri, chainIconUri }: IconsProps) {
  return (
    <View style={iconsStyles.container}>
      <Image
        style={iconsStyles.assetIcon}
        source={
          assetIconUri
            ? {
                uri: assetIconUri,
              }
            : require("../../../../../assets/token-placeholder.png")
        }
      />
      {chainIconUri && (
        <View style={iconsStyles.chainIconWrapper}>
          <Image
            source={{
              uri: chainIconUri,
            }}
            style={iconsStyles.chainIcon}
          />
        </View>
      )}
    </View>
  );
}

const iconSize = 40;

const iconsStyles = StyleSheet.create({
  container: { position: "relative" },
  assetIcon: {
    height: iconSize,
    width: iconSize,
  },
  chainIconWrapper: {
    width: 16,
    height: 16,
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.grey825,
    borderColor: Colors.grey825,
    borderRadius: 999,
    borderWidth: 1,
  },
  chainIcon: {
    height: 14,
    width: 14,
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

const placeholderFontSize = FontSizes.lg;
const placeholderLineHeight = placeholderFontSize * 1.2;
const chainFontSize = FontSizes.sm;
const chainLineHeight = chainFontSize * 1.5;

const labelsHeight = placeholderLineHeight + chainLineHeight;

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

export const selectorButtonHeight = Math.max(iconSize, labelsHeight);
