import React from "react";
import { Text, View } from "react-native";
import SafeLayout from "../components/SafeLayout";
import tw from "@/lib/tailwind";

export default function AddressBook() {
  return (
    <SafeLayout>
      <View style={tw`items-center`}>
        <Text style={tw`text-white`}>TODO</Text>
      </View>
    </SafeLayout>
  );
}
