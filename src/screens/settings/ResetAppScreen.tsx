import {
  Column,
  DangerButton,
  Paragraph,
  SafeLayout,
  TertiaryButton,
} from "@/components";
import {
  useAccountsStore,
  useOnboardingStore,
  useSettingsStore,
} from "@/store";
import { useAuthStore } from "@/store";
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
      <Column>
        <Paragraph>
          This will remove all application data including your accounts and
          settings. Are you sure?
        </Paragraph>

        <TertiaryButton
          title="No, take me from here"
          onPress={() => navigation.goBack()}
        />

        <DangerButton title="Yes, clear all app data" onPress={onRemove} />
      </Column>
    </SafeLayout>
  );
}
