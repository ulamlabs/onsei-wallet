import {
  Column,
  DangerButton,
  Headline,
  IconButton,
  Link,
  OptionGroup,
  Row,
  SafeLayout,
  TertiaryButton,
} from "@/components";
import { NETWORK_NAMES } from "@/const";
import { useAccountsStore, useModalStore, useSettingsStore } from "@/store";
import { FontSizes, FontWeights } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Edit2, ExportSquare } from "iconsax-react-native";
import { Linking, View } from "react-native";

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
  const {
    settings: { node },
  } = useSettingsStore();

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

  const handleShowDetails = () => {
    const network = NETWORK_NAMES[node];
    const url = `https://www.seiscan.app/${network}/accounts/${activeAccount?.address}`;
    Linking.openURL(url);
  };

  return (
    <SafeLayout>
      <Column style={{ justifyContent: "space-between", minHeight: "100%" }}>
        <View>
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
              navigateTo={"Your unique Recovery Phrase"}
              params={{ address }}
              askPin
            />
          </OptionGroup>
          {activeAccount?.address !== address && (
            <DangerButton
              title="Remove Wallet"
              onPress={onRemove}
              style={{ marginTop: 20 }}
            />
          )}
        </View>
        <TertiaryButton
          onPress={handleShowDetails}
          textStyle={{
            fontSize: FontSizes.sm,
            fontFamily: FontWeights.bold,
          }}
          iconSize={16}
          title="View details on SeiScan"
          icon={ExportSquare}
        />
      </Column>
    </SafeLayout>
  );
}
