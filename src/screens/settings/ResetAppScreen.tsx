import {
  Column,
  DangerButton,
  ResultHeader,
  SafeLayout,
  TertiaryButton,
} from "@/components";
import { clearAllTransactions } from "@/modules/transactions/storage";
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
      clearAllTransactions(),
    ]);
    onboardingStore.startOnboarding();
  }

  return (
    <SafeLayout>
      <Column style={{ minHeight: "100%", justifyContent: "space-between" }}>
        <Column
          style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
        >
          <ResultHeader
            type="Clear"
            header="Reset and clear app"
            description="Before you remove all accounts and data, make sure that your sectret phrase are backed up."
          />
        </Column>

        <Column>
          <DangerButton title="Reset app" onPress={onRemove} />
          <TertiaryButton title="Cancel" onPress={() => navigation.goBack()} />
        </Column>
      </Column>
    </SafeLayout>
  );
}
