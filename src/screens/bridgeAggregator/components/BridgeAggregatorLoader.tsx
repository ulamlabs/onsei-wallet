import { Loader, Text } from "@/components";
import { useMergedAssets } from "@/modules/mergedBridgeData/useMergedAssets";
import { useMergedChains } from "@/modules/mergedBridgeData/useMergedChains";
import { Colors, FontSizes } from "@/styles";
import { StyleSheet, View } from "react-native";

export function BridgeAggregatorLoader() {
  const { isLoading: isLoadingAssets } = useMergedAssets();
  const { isLoading: isLoadingChains } = useMergedChains();

  const isLoading = isLoadingAssets || isLoadingChains;

  return (
    <View style={[styles.container, !isLoading && { display: "none" }]}>
      <Loader size="base" color={Colors.text100} />
      <Text style={styles.text}>Fetching networks and tokens</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 240,
    gap: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: FontSizes.sm,
    lineHeight: FontSizes.sm * 1.2,
    color: Colors.text100,
  },
});
