import {
  Column,
  DangerButton,
  Headline,
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
import { Colors } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Trash } from "iconsax-react-native";
import { View } from "react-native";

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
      <Column style={{ minHeight: "100%", justifyContent: "space-between" }}>
        <Column
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            gap: 32,
          }}
        >
          <View
            style={{
              width: 108,
              height: 108,
              padding: 20,
              backgroundColor: Colors.danger100,
              borderRadius: 22,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Trash color={Colors.danger200} size={88} />
          </View>
          <Column style={{ gap: 8 }}>
            <Headline>Reset and clear app</Headline>
            <Paragraph style={{ textAlign: "center" }}>
              Before you remove all accounts and data, make sure that your
              sectret phrase are backed up.
            </Paragraph>
          </Column>
        </Column>

        <Column>
          <DangerButton
            style={{ backgroundColor: Colors.danger200 }}
            title="Reset app"
            onPress={onRemove}
          />

          <TertiaryButton title="Cancel" onPress={() => navigation.goBack()} />
        </Column>
      </Column>
    </SafeLayout>
  );
}
