import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeLayout } from "@/components";
import { BottomTabsParamList } from "@/navigation/BottomBarsNavigation";
import { MainStackParamList } from "@/navigation/MainScreenNavigation";
import { ConnectedStackParamList } from "@/navigation/ConnectedScreenNavigation";
import { useAccountsStore } from "@/store";
import { resetNavigationStack } from "@/utils";
import { useAuthStore } from "@/store";
import { Button, Text, View } from "react-native";
import tw from "@/lib/tailwind";

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
