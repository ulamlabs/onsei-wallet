import { Loader, SafeLayout, Text } from "@/components";
import { useMergedChains } from "@/modules/mergedBridgeData/useMergedChains";
import DashboardHeader from "@/navigation/header/DashboardHeader";
import DefaultHeaderTitle from "@/navigation/header/DefaultHeaderTitle";
import React from "react";
import { SelectorFrom, SelectorTo, SwitchFromTo } from "./assetSelector/";
import { useAggregatorStore } from "@/store/bridgeAggregator";
import { useMergedAssets } from "@/modules/mergedBridgeData/useMergedAssets";
import { useMergedRoutes } from "@/modules/mergedBridgeData/useMergedRoutes";
import { StyleSheet, View } from "react-native";
import { selectorFieldsGap } from "./assetSelector/const";
import { BridgeAggregatorLoader } from "./components/BridgeAggregatorLoader";
import { Colors, FontSizes } from "@/styles";

export function BridgeAggregator() {
  const store = useAggregatorStore();

  const { isLoading: isLoadingAssets } = useMergedAssets();
  const { isLoading: isLoadingChains } = useMergedChains();

  const isLoading = isLoadingAssets || isLoadingChains;

  const {
    calculateRoutes,
    isLoading: isLoadingRoutes,
    routes,
  } = useMergedRoutes();

  return (
    <>
      <DashboardHeader>
        <DefaultHeaderTitle title="Onsei bridge aggregator" />
      </DashboardHeader>
      <SafeLayout style={{ paddingBottom: 80 }}>
        <BridgeAggregatorLoader />
        <View
          style={[styles.selectorsContainer, isLoading && { display: "none" }]}
        >
          <View style={styles.selectors}>
            <SelectorFrom
              onAmountChange={(value) => {
                const nextState = store.setAmount(value);
                calculateRoutes(nextState);
              }}
            />
            <SelectorTo expectedAmount={routes?.[0]?.expectedReceive} />
          </View>
          <SwitchFromTo
            onPress={() => {
              const nextState = store.switchDirection();
              calculateRoutes(nextState);
            }}
          />
        </View>
        {isLoadingRoutes && (
          <View style={styles.loaderContainer}>
            <Loader size="base" color={Colors.text100} />
            <Text style={styles.loaderText}>Finding routes...</Text>
          </View>
        )}
      </SafeLayout>
    </>
  );
}

const styles = StyleSheet.create({
  selectorsContainer: {
    position: "relative", // for use in absolute positioning of SwitchFromTo
  },
  selectors: {
    gap: selectorFieldsGap,
  },
  loaderContainer: {
    height: 240,
    gap: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: {
    fontSize: FontSizes.sm,
    lineHeight: FontSizes.sm * 1.2,
    color: Colors.text100,
  },
});
