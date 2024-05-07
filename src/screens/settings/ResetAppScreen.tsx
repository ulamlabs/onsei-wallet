import { SafeLayout } from "@/components";
import {
  useAccountsStore,
  useOnboardingStore,
  useSettingsStore,
} from "@/store";
import { useAuthStore } from "@/store";
import { Button, Text, View } from "react-native";
import tw from "@/lib/tailwind";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type ResetAppScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Clear app data"
>;

export default function ResetAppScreen({ navigation }: ResetAppScreenProps) {
  const accountsStore = useAccountsStore();
  const authStore = useAuthStore();
  const onboardingStore = useOnboardingStore();
  const settingsStore = useSettingsStore();

  async function onRemove() {
    // TODO clear address book
    await Promise.all([
      accountsStore.clearStore(),
      authStore.resetPin(),
      settingsStore.reset(),
    ]);
    onboardingStore.startOnboarding();
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
          onPress={() => navigation.goBack()}
        />
        <Button
          title="Yes, clear all app data"
          color={tw.color("danger-400")}
          onPress={onRemove}
        />
      </View>
    </SafeLayout>
  );
}
