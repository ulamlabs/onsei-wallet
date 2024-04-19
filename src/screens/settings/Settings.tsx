import React from "react";
import { Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import SafeLayout from "@/components/SafeLayout";
import { BottomTabsParamList } from "@/navigation/BottomBarsNavigation";
import { MainStackParamList } from "@/navigation/MainScreenNavigation";
import { ConnectedStackParamList } from "@/navigation/ConnectedScreenNavigation";
import tw from "@/lib/tailwind";

type SettingsProps = NativeStackScreenProps<
  BottomTabsParamList & MainStackParamList & ConnectedStackParamList,
  "Settings"
>;

export default ({ navigation }: SettingsProps) => {
  return (
    <SafeLayout>
      <View style={tw`items-center`}>
        <Text style={tw`title`}>SETTINGS</Text>
        <Text style={tw`text-white`}>TODO</Text>
      </View>
    </SafeLayout>
  );
};
