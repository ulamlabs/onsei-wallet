import { Column, Link, OptionGroup, SafeLayout } from "@/components";
import { useSettingsStore } from "@/store";
import { Colors } from "@/styles";
import { Global, SecuritySafe, Wallet } from "iconsax-react-native";

export default function SettingsScreen() {
  const {
    settings: { node },
  } = useSettingsStore();

  return (
    <SafeLayout>
      <Column style={{ gap: 32 }}>
        <OptionGroup>
          <Link
            label="Manage Wallets"
            navigateTo="Wallets"
            icon={<Wallet size={22} color={Colors.text} />}
          />
          <Link
            label="Network"
            navigateTo="Select network"
            icon={<Global size={22} color={Colors.text} />}
            labelRight={node}
          />
        </OptionGroup>
        <OptionGroup>
          <Link
            label="Security and privacy"
            navigateTo="Security and privacy"
            icon={<SecuritySafe size={22} color={Colors.text} />}
          />
        </OptionGroup>
      </Column>
    </SafeLayout>
  );
}
