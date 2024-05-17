import {
  DangerButton,
  Headline,
  IconButton,
  Link,
  OptionGroup,
  Row,
  SafeLayout,
} from "@/components";
import { useAccountsStore, useModalStore } from "@/store";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Edit2 } from "iconsax-react-native";

type AccountSettingsProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Wallet settings"
>;

export default function AccountSettingsScreen({
  navigation,
  route: {
    params: { address },
  },
}: AccountSettingsProps) {
  const { accounts, deleteAccount, activeAccount } = useAccountsStore();
  const { ask } = useModalStore();
  const account = accounts.find((account) => account.address === address);

  async function onRemove() {
    if (!account) {
      return;
    }
    const yesno = await ask({
      title: "Remove account?",
      question:
        "Are you sure you want to remove this wallet?\nThis action cannot be reversed.",
      yes: "Yes, remove the wallet",
      no: "No, keep the wallet",
      primary: "yes",
      danger: true,
    });
    if (yesno) {
      await deleteAccount(account.address);
      navigation.goBack();
    }
  }

  return (
    <SafeLayout style={{ paddingTop: 24 }}>
      <Row
        style={{
          paddingHorizontal: 22,
          paddingVertical: 16,
          marginBottom: 32,
        }}
      >
        <Headline size="lg">{account?.name}</Headline>
        <IconButton
          icon={Edit2}
          onPress={() =>
            navigation.navigate("Edit name", { account: account! })
          }
        />
      </Row>
      <OptionGroup>
        <Link
          label="Show recovery phrase"
          navigateTo={"Your Mnemonic"}
          params={{ address }}
        />
      </OptionGroup>
      {activeAccount?.address !== address && (
        <DangerButton
          title="Remove Wallet"
          onPress={onRemove}
          style={{ marginTop: 20 }}
        />
      )}
    </SafeLayout>
  );
}
