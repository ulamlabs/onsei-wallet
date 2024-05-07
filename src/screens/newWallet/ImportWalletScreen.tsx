import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAccountsStore } from "@/store";
import { resetNavigationStack } from "@/utils";
import { useInputState } from "@/hooks";
import {
  SafeLayout,
  TextInput,
  PrimaryButton,
  Headline,
  Paragraph,
  Column,
  Loader,
} from "@/components";
import { NavigatorParamsList } from "@/types";
import { MNEMONIC_WORDS_COUNT } from "@/const";
import { Colors } from "@/styles";

type NewWalletProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Import Wallet"
>;

export default function ImportWalletScreen({ navigation }: NewWalletProps) {
  const accountsStore = useAccountsStore();
  const nameInput = useInputState();
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
        nameInput.value.trim(),
        mnemonicInput.value.trim(),
      );
      accountsStore.setActiveAccount(newAccount.address);
      accountsStore.subscribeToAccounts();

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

  return (
    <SafeLayout>
      <Column>
        <View>
          <Headline>Sign in with a recovery phrase</Headline>

          <Paragraph style={{ textAlign: "center" }}>
            This is a {MNEMONIC_WORDS_COUNT}-word phrase you were given when
            your created you previous crypto wallet.
          </Paragraph>
        </View>

        <TextInput placeholder="Name" autoCorrect={false} {...nameInput} />

        <TextInput
          multiline={true}
          placeholder="Mnemonic"
          autoCapitalize="none"
          autoCorrect={false}
          style={{ height: 100 }}
          {...mnemonicInput}
        />
        {error && <Text style={{ color: Colors.danger }}>{error}</Text>}

        {loading ? (
          <Loader />
        ) : (
          <PrimaryButton
            title="Import"
            onPress={onButtonPress}
            disabled={!(mnemonicInput.value && nameInput.value)}
          />
        )}
      </Column>
    </SafeLayout>
  );
}
