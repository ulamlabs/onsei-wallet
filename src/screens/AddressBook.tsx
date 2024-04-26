import React from "react";
import { Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeParamList } from "../navigation/HomeNavigation";
import { BottomTabsParamList } from "../navigation/BottomBarsNavigation";
import SafeLayout from "../components/SafeLayout";
import tw from "@/lib/tailwind";

type AddressBookProps = NativeStackScreenProps<
  BottomTabsParamList & HomeParamList,
  "Address Book"
>;

export default ({ navigation }: AddressBookProps) => {
  return (
    <SafeLayout>
      <View style={tw`items-center`}>
        <Text style={tw`text-white`}>TODO</Text>
      </View>
    </SafeLayout>
  );
};
