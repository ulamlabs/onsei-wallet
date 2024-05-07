import {
  Column,
  DangerButton,
  OptionGroup,
  Link,
  SafeLayout,
} from "@/components";
import { useAuthStore } from "@/store";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type SettingsProps = NativeStackScreenProps<NavigatorParamsList, "Settings">;

export default function SettingsScreen({ navigation }: SettingsProps) {
  const authStore = useAuthStore();

  async function onRemove() {
    authStore.authorize(navigation, "Clear app data", undefined);
  }

  return (
    <SafeLayout>
      <Column>
        <OptionGroup>
          <Link label="Security" navigateTo="Security" />
        </OptionGroup>

        <DangerButton title="Clear app data" onPress={onRemove} />
      </Column>
    </SafeLayout>
  );
}
