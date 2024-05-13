import {
  DangerButton,
  Headline,
  IconButton,
  Link,
  OptionGroup,
  Paragraph,
  Row,
  SafeLayout,
  SwitchWithLabel,
} from "@/components";
import { useAccountsStore, useAuthStore, useModalStore } from "@/store";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Edit2 } from "iconsax-react-native";
import { View } from "react-native";

type AccountSettingsProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Account settings"
>;

export default function AccountSettings({
  navigation,
  route: {
    params: { address },
  },
}: AccountSettingsProps) {
  const { accounts, toggleAccountOption, deleteAccount, activeAccount } =
    useAccountsStore();
  const { authorize, state } = useAuthStore();
  const { ask } = useModalStore();
  const selectedAccount = accounts.find(
    (account) => account.address === address,
  );

  const toggleAssets = () => {
    toggleAccountOption("hideAssetsValue", address);
  };

  const toggleNotifications = () => {
    toggleAccountOption("allowNotifications", address);
  };

  const showRecoveryPhrase = () => {
    if (state !== "noPin") {
      authorize(navigation, "Your Mnemonic", { address });
      return;
    }

    navigation.navigate("Your Mnemonic", { address });
  };

  async function onRemove() {
    if (!selectedAccount) {
      return;
    }
    const yesno = await ask({
      title: "Remove account?",
      question:
        "Are you sure you want to remove this account?\nThis action cannot be reversed.",
      yes: "Yes, remove the account",
      no: "No, keep the account",
      primary: "yes",
      danger: true,
    });
    if (yesno) {
      await deleteAccount(selectedAccount.address);
      navigation.goBack();
    }
  }

  function render() {
    if (!selectedAccount) {
      return <Paragraph>Something went wrong</Paragraph>;
    }
    return (
      <>
        <Row
          style={{
            paddingHorizontal: 22,
            paddingVertical: 16,
            marginBottom: 32,
          }}
        >
          <Headline size="h2">{selectedAccount?.name}</Headline>
          <IconButton
            icon={Edit2}
            onPress={() =>
              navigation.navigate("Edit name", { account: selectedAccount })
            }
          />
        </Row>
        <View style={{ gap: 1 }}>
          <OptionGroup>
            <SwitchWithLabel
              onChange={toggleAssets}
              value={selectedAccount.hideAssetsValue}
              label="Hide assets value"
            />
            <SwitchWithLabel
              onChange={toggleNotifications}
              value={selectedAccount.allowNotifications}
              label="Allow notifications"
            />
            <Link label="Show recovery phrase" onPress={showRecoveryPhrase} />
          </OptionGroup>
          {activeAccount?.address !== address && (
            <DangerButton
              title="Remove Account"
              onPress={onRemove}
              style={{ marginTop: 20 }}
            />
          )}
        </View>
      </>
    );
  }

  return <SafeLayout style={{ paddingTop: 24 }}>{render()}</SafeLayout>;
}
