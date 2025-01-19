import Decimal from "decimal.js";
import { formatAmount } from "./utils";
import { useAggregatorStore } from "@/store/bridgeAggregator";
import { ArrowDown2 } from "iconsax-react-native";
import { StyleSheet, View } from "react-native";
import { Colors, FontSizes, FontWeights } from "@/styles";
import { Text } from "@/components";

type Props = {
  expectedReceive: string;
  expectedReceiveUsd: string;
  open: boolean;
};

export function RouteDetailsHeader({
  expectedReceive,
  expectedReceiveUsd,
  open,
}: Props) {
  const store = useAggregatorStore();

  const decimals = store.toAsset?.decimals ?? 0;
  const symbol = store.toAsset?.symbol ?? "";

  const formattedExpectedReceive = formatAmount(
    expectedReceive,
    decimals,
    symbol,
  );

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.amount}>{formattedExpectedReceive}</Text>
        <Text style={styles.amountUsd}>{`$${formatFiat(
          expectedReceiveUsd,
        )}`}</Text>
      </View>
      <ArrowDown2
        style={[styles.icon, open && { transform: [{ rotate: "180deg" }] }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "space-between",
  },
  amount: {
    color: Colors.text,
    fontFamily: FontWeights.bold,
    fontSize: FontSizes.lg,
    lineHeight: FontSizes.lg * 1.2,
  },
  amountUsd: {
    color: Colors.text100,
    fontSize: FontSizes.sm,
    lineHeight: FontSizes.sm * 1.5,
  },
  icon: {
    color: Colors.text,
    width: 20,
    height: 20,
  },
});

// remove thousand separators and make sure decimal part is max 2 digits,
// e.g. 123,000.2001 -> 123000.20
const formatFiat = (value: string) =>
  new Decimal(value.split(",").join("")).toFixed(2);
