import { SafeLayout } from "@/components";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet } from "react-native";
import { SelectAssetView } from "./assetSelector";

type Props = NativeStackScreenProps<NavigatorParamsList, "BridgeAssets">;

export default function BridgeAggregatorAssets({ navigation }: Props) {
  return (
    <SafeLayout>
      <SelectAssetView />
    </SafeLayout>
  );
}

const styles = StyleSheet.create({});
