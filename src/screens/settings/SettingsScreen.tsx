import { Button, Link, SafeLayout } from "@/components";
import { useAuthStore } from "@/store";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";

type SettingsProps = NativeStackScreenProps<NavigatorParamsList, "Settings">;

export default function SettingsScreen({ navigation }: SettingsProps) {
  const authStore = useAuthStore();

  async function onRemove() {
    authStore.authorize(navigation, "Clear app data", undefined);
  }

  return (
    <SafeLayout>
      <Link label="Security" navigateTo="Security" />
      <Button label="Clear app data" onPress={onRemove} />
    </SafeLayout>
  );
}
