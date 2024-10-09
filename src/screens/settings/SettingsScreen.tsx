import {
  Column,
  ExternalLink,
  Link,
  OptionGroup,
  SafeLayout,
  SwitchWithLabel,
} from "@/components";
import { APP_NAME, WALLET_ADMIN_ADDRESS } from "@/const";
import { useSettingsStore } from "@/store";
import { Colors } from "@/styles";
import {
  CardEdit,
  Document,
  Note,
  Notification,
  SecuritySafe,
  Wallet,
  WalletMoney,
} from "iconsax-react-native";

export default function SettingsScreen() {
  const {
    settings: { node, allowNotifications }, // TODO: use again when mainnet ready:  settings: { node, ["walletConnet.sessions"]: sessions, allowNotifications }
    setSetting,
  } = useSettingsStore();

  const toggleNotifications = () => {
    setSetting("allowNotifications", !allowNotifications);
  };

  return (
    <SafeLayout>
      <Column style={{ gap: 32 }}>
        <OptionGroup>
          <Link
            label="Manage Wallets"
            navigateTo="Wallets"
            icon={<Wallet size={22} color={Colors.text} />}
          />
          {/* <Link
            label="Network"
            navigateTo="Select network"
            icon={<Global size={22} color={Colors.text} />}
            labelRight={node}
          /> TODO: use this again after mainnet*/}
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
          {/* <Link
            label="Connected Apps"
            navigateTo="Connected Apps"
            icon={<Blend size={22} color={Colors.text} />}
            labelRight={
              sessions?.length > 0 ? sessions.length.toString() : undefined
            }
          /> TODO: use again when mainnet ready */}
        </OptionGroup>
        <OptionGroup>
          <Link
            label="Security and privacy"
            navigateTo="Security and privacy"
            icon={<SecuritySafe size={22} color={Colors.text} />}
          />
          <ExternalLink
            label="Terms of service"
            navigateTo="https://www.onseiwallet.io/terms-and-conditions"
            icon={<Document size={22} color={Colors.text} />}
          />
          <ExternalLink
            label="Privacy policy"
            navigateTo="https://www.onseiwallet.io/privacy-policy"
            icon={<Note size={22} color={Colors.text} />}
          />
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
        </OptionGroup>
      </Column>
    </SafeLayout>
  );
}
