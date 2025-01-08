import { Text } from "@/components";
import { MergedAsset, MergedChain } from "@/modules/mergedBridgeData/types";
import { Colors, FontSizes } from "@/styles";
import { StyleSheet, View } from "react-native";
import { SelectorButton, selectorButtonHeight } from "./SelectorButton";

type Props = {
  amount?: string;
  amountInputId?: string;
  asset?: MergedAsset;
  chain?: MergedChain;
  label: string;
  onAmountChange?: (value: string) => void;
  onSelectorOpen: () => void;
};

export function SelectorField({
  amount,
  amountInputId,
  asset,
  chain,
  label,
  onAmountChange,
  onSelectorOpen,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View>
        <SelectorButton asset={asset} chain={chain} onPress={onSelectorOpen} />
      </View>
    </View>
  );
}

const padding = 22;
const gap = 10;
const labelFontSize = FontSizes.sm;
const lableLineHeight = labelFontSize * 1.5;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.tokenBoxBackground,
    borderRadius: 24,
    padding,
    gap,
  },
  label: {
    color: Colors.text100,
    fontSize: labelFontSize,
    lineHeight: lableLineHeight,
  },
});

export const selectorFieldHeight =
  padding + lableLineHeight + gap + selectorButtonHeight + lableLineHeight;
