import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import SafeLayout from "@/components/SafeLayout";
import PrimaryButton from "@/components/PrimaryButton";
import { Link } from "@/components";
import { useAuthStore } from "@/store/authStore";
import { NavigatorParamsList } from "@/types";

type SettingsProps = NativeStackScreenProps<NavigatorParamsList, "Settings">;

export default ({ navigation }: SettingsProps) => {
  const authStore = useAuthStore();

  async function onRemove() {
    authStore.authorize(
      navigation,
      "Remove all accounts and logout",
      undefined
    );
  }

  return (
    <SafeLayout>
      <Link label="Security" navigation={navigation} navigateTo="Security" />
      <PrimaryButton
        label="Remove all accounts and logout"
        onPress={onRemove}
      />
    </SafeLayout>
  );
};
