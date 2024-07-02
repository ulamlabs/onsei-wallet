import {
  Column,
  Headline,
  IconButton,
  Link,
  LinkIcon,
  NoBackupIcon,
  OptionGroup,
  Row,
  SafeLayout,
  TertiaryButton,
  Text,
} from "@/components";
import { NETWORK_NAMES } from "@/const";
import { clearTransactionsForAddress } from "@/modules/transactions/storage";
import { useAccountsStore, useModalStore, useSettingsStore } from "@/store";
import { Colors, FontSizes, FontWeights } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Edit2,
  ExportSquare,
  LinkCircle,
  SecuritySafe,
  Trash,
} from "iconsax-react-native";
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
  const account = accounts.find((account) => account.address === address)!;
  const truncatedAddresses = `${account.address.slice(0, 4)}(...), ${account.evmAddress.slice(0, 4)}(...)`;
  const {
    settings: { node },
  } = useSettingsStore();

  const infoBoxStyle = {
    paddingHorizontal: 22,
    paddingVertical: 16,
    borderRadius: 22,
    borderWidth: 1,
    flex: 1,
  };

  async function onRemove() {
    const yesno = await ask({
      title: "Remove wallet?",
      question:
        "Are you sure you want to remove this wallet?\nThis action cannot be reversed.",
      yes: "Yes, remove the wallet",
      no: "No, keep the wallet",
      primary: "yes",
      danger: true,
      headerStyle: { textAlign: "left" },
    });
    if (yesno) {
      clearTransactionsForAddress(account.address);
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
            {account.passphraseSkipped ? (
              <Link
                label="Recovery phrase"
                icon={<NoBackupIcon />}
                navigateTo="Your unique Recovery Phrase"
                params={{ address, needsConfirmation: true }}
                labelRight="Back up"
                askPin
              />
            ) : (
              <Link
                label="Show recovery phrase"
                navigateTo="Your unique Recovery Phrase"
                params={{ address }}
                askPin
              />
            )}
            {!account.addressLinked && (
              <Link
                label="Link addresses"
                icon={<LinkIcon />}
                navigateTo="Link Addresses"
                params={{ address }}
                labelRight={truncatedAddresses}
              />
            )}
          </OptionGroup>

          <Column style={{ marginTop: 32 }}>
            {account.passphraseSkipped && (
              <Row
                style={{
                  ...infoBoxStyle,
                  backgroundColor: Colors.warningBackground,
                  borderColor: Colors.warningBorder,
                }}
              >
                <SecuritySafe size={22} color={Colors.warningText} />
                <Text style={{ flex: 1, color: Colors.warningText }}>
                  Back up your Recovery Phrase to restore your wallet if you
                  lose your device.
                </Text>
              </Row>
            )}

            {!account.addressLinked && (
              <Row
                style={{
                  ...infoBoxStyle,
                  backgroundColor: Colors.markerBackground100,
                  borderColor: Colors.markerBorder,
                }}
              >
                <LinkCircle size={22} color={Colors.markerText100} />
                <Text style={{ flex: 1, color: Colors.markerText100 }}>
                  Link Sei & EVM addresses to explore Sei V2
                </Text>
              </Row>
            )}
          </Column>

          {activeAccount?.address !== address && (
            <TertiaryButton
              title="Remove Wallet"
              icon={Trash}
              color={Colors.danger}
              style={{ marginTop: 20 }}
              textStyle={{ fontFamily: FontWeights.bold }}
              onPress={onRemove}
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
