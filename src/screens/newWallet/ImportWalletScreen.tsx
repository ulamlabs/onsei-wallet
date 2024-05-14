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
import { resetNavigationStack } from "@/utils";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Lock } from "iconsax-react-native";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

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
      const newAccount = await accountsStore.importAccount(
        mnemonicInput.value.trim(),
      );
      accountsStore.setActiveAccount(newAccount.address);

      const nextRoute: keyof NavigatorParamsList =
        navigation.getId() === "onboarding" ? "Protect Your Wallet" : "Home";
      navigation.navigate(nextRoute);
      resetNavigationStack(navigation);
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
          <Headline>Sign in with a recovery phrase</Headline>
          <Paragraph style={{ textAlign: "center" }}>
            This is a {MNEMONIC_WORDS_COUNT}-word phrase you were given when
            your created you previous crypto wallet.
          </Paragraph>
        </View>

        <TextInput
          multiline={true}
          placeholder="Secret recovery phrase"
          autoCapitalize="none"
          autoCorrect={false}
          showClear={!!mnemonicInput.value}
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
          <Lock color={Colors.textBlue} />
          <Paragraph
            style={{
              color: Colors.textBlue,
              fontSize: 12,
              lineHeight: 18,
            }}
          >
            Remember, SEI Wallet ensures your funds' security and cannot access
            your account. You retain sole control over your funds.
          </Paragraph>
        </Row>
      </Column>
    </SafeLayout>
  );
}
