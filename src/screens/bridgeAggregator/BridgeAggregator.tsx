import { SafeLayout } from "@/components";
import { useMergedChains } from "@/modules/mergedBridgeData/useMergedChains";
import DashboardHeader from "@/navigation/header/DashboardHeader";
import DefaultHeaderTitle from "@/navigation/header/DefaultHeaderTitle";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";

type BridgeAggregatorProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Bridge"
>;

export default function BridgeAggregator({
  navigation,
}: BridgeAggregatorProps) {
  const { data } = useMergedChains();
  console.log(data);

  return (
    <>
      <DashboardHeader>
        <DefaultHeaderTitle title="Onsei bridge aggregator" />
      </DashboardHeader>
      <SafeLayout style={{ paddingBottom: 80 }}></SafeLayout>
    </>
  );
}
