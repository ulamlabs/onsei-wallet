import React from "react";
import { Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import SafeLayout from "@/components/SafeLayout";
import { BottomTabsParamList } from "@/navigation/BottomBarsNavigation";
import { MainStackParamList } from "@/navigation/MainScreenNavigation";
import { ConnectedStackParamList } from "@/navigation/ConnectedScreenNavigation";
import PrimaryButton from "@/components/PrimaryButton";
import { useAccountsStore } from "@/store";
import { resetNavigationStack } from "@/utils";
import tw from "@/lib/tailwind";

type SettingsProps = NativeStackScreenProps<
  BottomTabsParamList & MainStackParamList & ConnectedStackParamList,
  "Settings"
>;

export default ({ navigation }: SettingsProps) => {
  const accountsStore = useAccountsStore();

  async function onRemove() {
    accountsStore.clearStore();
    // TODO clear address book
    navigation.navigate("Init");
    resetNavigationStack(navigation);
  }

  return (
    <SafeLayout>
      <View style={tw`items-center`}>
        <Text style={tw`title`}>SETTINGS</Text>

        <PrimaryButton
          label="Remove all accounts and logout"
          onPress={onRemove}
        />
      </View>
    </SafeLayout>
  );
};
