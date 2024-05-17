import {
  Column,
  Headline,
  Loader,
  Paragraph,
  PrimaryButton,
  Row,
  SafeLayout,
  TextInput,
} from "@/components";
import { MNEMONIC_WORDS_COUNT } from "@/const";
import { useInputState } from "@/hooks";
import { useAccountsStore } from "@/store";
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

export default function ImportWalletScreen({ navigation }: NewWalletProps) {
  const accountsStore = useAccountsStore();
  const mnemonicInput = useInputState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) {
      onImport();
    }
  }, [loading]);

  async function onImport() {
    try {
      const wallet = await accountsStore.restoreWallet(mnemonicInput.value);
      await storeNewAccount(accountsStore, navigation, wallet!, false);
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
          <Headline>Sign in with a Recovery Phrase</Headline>
          <Paragraph style={{ textAlign: "center" }}>
            This is a {MNEMONIC_WORDS_COUNT}-word phrase you were given when you
            created your previous crypto wallet.
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

        {loading ? (
          <Loader />
        ) : (
          <PrimaryButton
            title="Import"
            onPress={onButtonPress}
            style={{ marginTop: 24 }}
            disabled={!mnemonicInput.value}
          />
        )}
        <Row style={{ justifyContent: "flex-start" }}>
          <Lock color={Colors.info} />
          <Paragraph
            style={{
              color: Colors.info,
              flex: 1,
            }}
            size="xs"
          >
            Remember, SEI Wallet ensures your funds' security and cannot access
            your wallet. You retain sole control over your funds.
          </Paragraph>
        </Row>
      </Column>
    </SafeLayout>
  );
}
