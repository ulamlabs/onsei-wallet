import {
  Column,
  Link,
  OptionGroup,
  SafeLayout,
  SwitchWithLabel,
} from "@/components";
import { APP_NAME, WALLET_ADMIN_ADDRESS } from "@/const";
import { useSettingsStore } from "@/store";
import { Colors } from "@/styles";
import {
  Blend,
  Book,
  CardEdit,
  Global,
  Notification,
  SecuritySafe,
  Wallet,
  WalletMoney,
} from "iconsax-react-native";

export default function SettingsScreen() {
  const {
    settings: { node, ["walletConnet.sessions"]: sessions, allowNotifications },
    setSetting,
  } = useSettingsStore();

  const toggleNotifications = () => {
    setSetting("allowNotifications", !allowNotifications);
  };

  return (
    <SafeLayout subScreen>
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
          <Link
            label="Transactions settings"
            navigateTo="Transaction settings"
            icon={<CardEdit size={22} color={Colors.text} />}
            params={{ global: true }}
          />
          <SwitchWithLabel
            icon={<Notification size={22} color={Colors.text} />}
            label="Allow notifications"
            value={allowNotifications}
            onChange={toggleNotifications}
          />
          <Link
            label="Connected Apps"
            navigateTo="Connected Apps"
            icon={<Blend size={22} color={Colors.text} />}
            labelRight={
              sessions?.length > 0 ? sessions.length.toString() : undefined
            }
          />
          <Link
            label="Address Book"
            navigateTo="Address Book"
            icon={<Book size={22} color={Colors.text} />}
            params={{ addressCount: 0 }}
          />
        </OptionGroup>
        <OptionGroup>
          {node === "MainNet" && (
            <Link
              label="Give us a Tip!"
              navigateTo="transferSelectToken"
              params={{
                recipient: {
                  address: WALLET_ADMIN_ADDRESS,
                  name: APP_NAME,
                },
              }}
              icon={<WalletMoney size={22} color={Colors.text} />}
            />
          )}
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
