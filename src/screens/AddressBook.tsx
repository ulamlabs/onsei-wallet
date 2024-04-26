import React from "react";
import { Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import SafeLayout from "../components/SafeLayout";
import tw from "@/lib/tailwind";
import { NavigatorParamsList } from "@/types";

type AddressBookProps = NativeStackScreenProps<
  NavigatorParamsList,
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
