import { Text } from "@/components";
import { MergedAsset, MergedChain } from "@/modules/mergedBridgeData/types";
import { Colors, FontSizes } from "@/styles";
import { StyleSheet, View } from "react-native";
import { SelectorButton, selectorButtonHeight } from "./SelectorButton";
import { Amount } from "./Amount";
import { AmountInput } from "./AmountInput";

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
      <View style={styles.content}>
        <SelectorButton asset={asset} chain={chain} onPress={onSelectorOpen} />
        {amount !== undefined && amountInputId && onAmountChange ? (
          <AmountInput
            decimals={asset?.decimals ?? 18}
            id={amountInputId}
            value={amount}
            onChange={onAmountChange}
          />
        ) : (
          <Amount amount={amount} />
        )}
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
  content: {
    gap: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export const selectorFieldHeight =
  padding + lableLineHeight + gap + selectorButtonHeight + lableLineHeight;
