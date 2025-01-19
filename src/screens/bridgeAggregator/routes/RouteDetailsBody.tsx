import { BridgeEnum } from "@/modules/mergedBridgeData/types";
import { formatAmount } from "./utils";
import { useAggregatorStore } from "@/store/bridgeAggregator";
import { StyleSheet, View } from "react-native";
import { Colors, FontSizes } from "@/styles";
import { Text } from "@/components";

type Props = {
  bridge: BridgeEnum;
  expectedReceive: string;
  minReceive?: string;
  open: boolean;
};

export function RouteDetailsBody({
  bridge,
  expectedReceive,
  minReceive,
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

  const formattedMinReceive =
    minReceive && formatAmount(minReceive, decimals, symbol);

  return (
    <View style={[styles.container, { display: open ? "flex" : "none" }]}>
      <View>
        <View style={styles.receiveAmountsContainer}>
          <View style={styles.valueRow}>
            <Text style={styles.label}>{"Expected receive"}</Text>
            <Text style={styles.value}>{formattedExpectedReceive}</Text>
          </View>
          {formattedMinReceive && (
            <View style={styles.valueRow}>
              <Text style={styles.label}>{"Min receive"}</Text>
              <Text style={styles.value}>{formattedMinReceive}</Text>
            </View>
          )}
        </View>
        <View style={styles.note}>
          <Text style={styles.noteText}>
            {
              "Note: To get more accurate gas fees, check out the bridge's website"
            }
          </Text>
        </View>
      </View>
      {/* <BridgeLink bridge={bridge} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 28,
  },
  note: {
    paddingTop: 12,
    marginTop: 12,
    borderTopWidth: 1,
    borderColor: Colors.grey750,
  },
  noteText: {
    color: Colors.text100,
    fontSize: FontSizes.sm,
    lineHeight: FontSizes.sm * 1.5,
  },
  receiveAmountsContainer: {
    paddingTop: 12,
    marginTop: 12,
    borderTopWidth: 1,
    borderColor: Colors.grey750,
    gap: 8,
  },
  valueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    color: Colors.text100,
    fontSize: FontSizes.sm,
    lineHeight: FontSizes.sm * 1.5,
  },
  value: {
    color: Colors.text,
    fontSize: FontSizes.sm,
    lineHeight: FontSizes.sm * 1.5,
  },
});
