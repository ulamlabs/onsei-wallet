import { SafeLayout } from "@/components";
import tw from "@/lib/tailwind";
import { BottomTabsParamList } from "@/navigation/BottomBarsNavigation";
import { ConnectedStackParamList } from "@/navigation/ConnectedScreenNavigation";
import { MainStackParamList } from "@/navigation/MainScreenNavigation";
import { useAccountsStore, useAuthStore } from "@/store";
import { resetNavigationStack } from "@/utils";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { Button, Text, View } from "react-native";

type SettingsProps = NativeStackScreenProps<
  BottomTabsParamList & MainStackParamList & ConnectedStackParamList,
  "Clear app data"
>;

export default ({ navigation }: SettingsProps) => {
  const accountsStore = useAccountsStore();
  const authStore = useAuthStore();

  async function onRemove() {
    accountsStore.clearStore();
    await authStore.resetPin();
    // TODO clear address book
    resetNavigationStack(navigation);
    navigation.navigate("Home"); // override the current view on the stack. Otherwise, after onboarding the user is redirected to ResetAppScreen.
    navigation.navigate("Init");
  }

  return (
    <SafeLayout>
      <View style={{ gap: 10 }}>
        <Text style={{ color: "white" }}>
          This will remove all application data including your accounts. Are you
          sure?
        </Text>

        <Button
          title="No, take me from here"
          onPress={() => navigation.navigate("Home")}
        />
        <Button
          title="Yes, clear all app data"
          color={tw.color("danger-400")}
          onPress={onRemove}
        />
      </View>
    </SafeLayout>
  );
};
