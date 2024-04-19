import React from "react";
import { Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ConnectedStackParamList } from "../navigation/ConnectedScreenNavigation";
import { BottomTabsParamList } from "../navigation/BottomBarsNavigation";
import SafeLayout from "../components/SafeLayout";
import tw from "@/lib/tailwind";

type AddressBookProps = NativeStackScreenProps<
  BottomTabsParamList & ConnectedStackParamList,
  "Address Book"
>;

export default ({ navigation }: AddressBookProps) => {
  return (
    <SafeLayout>
      <View style={tw`items-center`}>
        <Text style={tw`title`}>ADDRESS BOOK</Text>
        <Text style={tw`text-white`}>TODO</Text>
      </View>
    </SafeLayout>
  );
};
