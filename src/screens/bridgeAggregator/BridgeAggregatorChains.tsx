import { SafeLayout } from "@/components";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet } from "react-native";

type Props = NativeStackScreenProps<NavigatorParamsList, "BridgeChains">;

export default function BridgeAggregatorChains({ navigation }: Props) {
  return <SafeLayout style={{ paddingBottom: 80 }}></SafeLayout>;
}

const styles = StyleSheet.create({});
