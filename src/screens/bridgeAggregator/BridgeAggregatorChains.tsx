import { SafeLayout } from "@/components";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet } from "react-native";
import { SelectChainView } from "./assetSelector";

type Props = NativeStackScreenProps<NavigatorParamsList, "BridgeChains">;

export default function BridgeAggregatorChains({ navigation }: Props) {
  return (
    <SafeLayout>
      <SelectChainView />
    </SafeLayout>
  );
}

const styles = StyleSheet.create({});
