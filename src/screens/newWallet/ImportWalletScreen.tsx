import {
  Column,
  Headline,
  LinkAddresses,
  Paragraph,
  PrimaryButton,
  Row,
  SafeLayout,
  TextInput,
} from "@/components";
import { useInputState } from "@/hooks";
import { isAddressLinked } from "@/services/evm";
import { useAccountsStore, useModalStore } from "@/store";
import { Colors } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Lock } from "iconsax-react-native";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { storeNewAccount } from "./storeNewAccount";

type NewWalletProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Import Wallet"
>;

export default function ImportWalletScreen({
  navigation,
  route,
}: NewWalletProps) {
  const accountsStore = useAccountsStore();
  const mnemonicInput = useInputState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { alert } = useModalStore();

  useEffect(() => {
    if (loading) {
      onImport();
    }
  }, [loading]);

  async function onImport() {
    try {
      const wallet = await accountsStore.restoreWallet(mnemonicInput.value);
      const isLinked = await isAddressLinked(wallet.address);
      await storeNewAccount(
        accountsStore,
        navigation,
        wallet!,
        false,
        isLinked,
        route.params?.name,
      );
      if (!isLinked) {
        alert({
          title: "Link addresses",
          description: <LinkAddresses address={wallet!.address} />,
          useHeadline: true,
          hideOk: true,
        });
      }
    } catch (e: any) {
      console.error("Error on wallet import:", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function onButtonPress() {
    setError("");
    setLoading(true);
  }

  useEffect(() => {
    setError("");
  }, [mnemonicInput.value]);

  return (
    <SafeLayout>
      <Column>
        <View style={{ marginBottom: 20 }}>
          <Headline>
            {route.params?.name
              ? "Import wallet with your unique Recovery Phrase"
              : "Sign in with Recovery Phrase"}
          </Headline>
          <Paragraph style={{ textAlign: "center" }}>
            This is a recovery phrase you were given when you created your
            previous crypto wallet.
          </Paragraph>
        </View>

        <TextInput
          multiline={true}
          placeholder="Secret Recovery Phrase"
          autoCapitalize="none"
          autoCorrect={false}
          showClear={!!mnemonicInput.value}
          style={{ minHeight: 80 }}
          {...mnemonicInput}
        />
        {error && <Text style={{ color: Colors.danger }}>{error}</Text>}

        <PrimaryButton
          title="Import"
          onPress={onButtonPress}
          style={{ marginTop: 24 }}
          disabled={!mnemonicInput.value}
          loading={loading}
        />

        <Row style={{ justifyContent: "flex-start" }}>
          <Lock color={Colors.info} />
          <Paragraph
            style={{
              color: Colors.info,
              flex: 1,
            }}
            size="xs"
          >
            Remember, Onsei Wallet ensures your funds' security and cannot
            access your wallet. You retain sole control over your funds.
          </Paragraph>
        </Row>
      </Column>
    </SafeLayout>
  );
}
