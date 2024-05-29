import {
  Column,
  DangerButton,
  Paragraph,
  SafeLayout,
  TertiaryButton,
} from "@/components";
import {
  useAccountsStore,
  useAddressBookStore,
  useAuthStore,
  useOnboardingStore,
  useSettingsStore,
} from "@/store";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type ResetAppScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Clear app data"
>;

export default function ResetAppScreen({ navigation }: ResetAppScreenProps) {
  const accountsStore = useAccountsStore();
  const authStore = useAuthStore();
  const addressBookStore = useAddressBookStore();
  const onboardingStore = useOnboardingStore();
  const settingsStore = useSettingsStore();

  async function onRemove() {
    await Promise.all([
      accountsStore.clearStore(),
      authStore.resetPin(),
      addressBookStore.clearAddressBook(),
      settingsStore.reset(),
    ]);
    onboardingStore.startOnboarding();
  }

  return (
    <SafeLayout>
      <Column>
        <Paragraph>
          This will remove all application data including your wallets and
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
