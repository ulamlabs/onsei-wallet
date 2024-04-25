import React from "react";
import { Text, View } from "react-native";
import { SafeLayout } from "@/components";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabsParamList } from "@/navigation/BottomBarsNavigation";
import { ConnectedStackParamList } from "@/navigation/ConnectedScreenNavigation";
import { MainStackParamList } from "@/navigation/MainScreenNavigation";
import tw from "@/lib/tailwind";

type WalletOverviewProps = NativeStackScreenProps<
  MainStackParamList & BottomTabsParamList & ConnectedStackParamList,
  "My wallet"
>;

export default ({ navigation }: WalletOverviewProps) => {
  return (
    <SafeLayout>
      <View style={tw`items-center`}>
        <Text style={tw`title`}>PORTFOLIO</Text>
        <Text style={tw`text-white`}>TODO</Text>
      </View>
    </SafeLayout>
  );
};
