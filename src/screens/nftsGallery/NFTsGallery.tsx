import { SafeLayout, Text } from "@/components";
import DashboardHeader from "@/navigation/header/DashboardHeader";
import DefaultHeaderTitle from "@/navigation/header/DefaultHeaderTitle";
import React from "react";
import { View } from "react-native";

export default function NFTsGallery() {
  return (
    <>
      <DashboardHeader>
        <DefaultHeaderTitle title="NFTs" />
      </DashboardHeader>
      <SafeLayout>
        <View>
          <Text>NFTs</Text>
        </View>
      </SafeLayout>
    </>
  );
}
