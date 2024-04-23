import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeLayout, PrimaryButton, Link } from "@/components";
import { useAuthStore } from "@/store";
import { NavigatorParamsList } from "@/types";

type SettingsProps = NativeStackScreenProps<NavigatorParamsList, "Settings">;

export default ({ navigation }: SettingsProps) => {
  const authStore = useAuthStore();

  async function onRemove() {
    authStore.authorize(navigation, "Clear app data", undefined);
  }

  return (
    <SafeLayout>
      <Link label="Security" navigateTo="Security" />
      <PrimaryButton label="Clear app data" onPress={onRemove} />
    </SafeLayout>
  );
};
