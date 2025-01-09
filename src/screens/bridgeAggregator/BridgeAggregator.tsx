import { SafeLayout } from "@/components";
import { useMergedChains } from "@/modules/mergedBridgeData/useMergedChains";
import DashboardHeader from "@/navigation/header/DashboardHeader";
import DefaultHeaderTitle from "@/navigation/header/DefaultHeaderTitle";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { SelectorFrom, SelectorTo, SwitchFromTo } from "./assetSelector/";
import { useAggregatorStore } from "@/store/bridgeAggregator";
import { useMergedAssets } from "@/modules/mergedBridgeData/useMergedAssets";
import { useMergedRoutes } from "@/modules/mergedBridgeData/useMergedRoutes";
import { StyleSheet, View } from "react-native";
import { selectorFieldsGap } from "./assetSelector/const";

type BridgeAggregatorProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Bridge"
>;

export function BridgeAggregator({ navigation }: BridgeAggregatorProps) {
  const store = useAggregatorStore();

  const { isLoading: isLoadingAssets } = useMergedAssets();
  const { isLoading: isLoadingChains } = useMergedChains();

  const isLoading = isLoadingAssets || isLoadingChains;

  const {
    calculateRoutes,
    mutation: { data: routes, isPending: isLoadingRoutes },
  } = useMergedRoutes();

  return (
    <>
      <DashboardHeader>
        <DefaultHeaderTitle title="Onsei bridge aggregator" />
      </DashboardHeader>
      <SafeLayout style={{ paddingBottom: 80 }}>
        <View style={styles.selectorsContainer}>
          <View style={styles.selectors}>
            <SelectorFrom
              onAssetSelect={(value) => {
                const nextState = store.setFromAsset(value);
                calculateRoutes(nextState);
              }}
              onAmountChange={(value) => {
                const nextState = store.setAmount(value);
                calculateRoutes(nextState);
              }}
            />
            <SelectorTo
              onAssetSelect={(value) => {
                const nextState = store.setToAsset(value);
                calculateRoutes(nextState);
              }}
              expectedAmount={routes?.[0]?.expectedReceive}
            />
          </View>
          <SwitchFromTo
            onPress={() => {
              const nextState = store.switchDirection();
              calculateRoutes(nextState);
            }}
          />
        </View>
      </SafeLayout>
    </>
  );
}

const styles = StyleSheet.create({
  selectorsContainer: { position: "relative" },
  selectors: {
    gap: selectorFieldsGap,
  },
});
