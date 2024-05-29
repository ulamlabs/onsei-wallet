import {
  Column,
  CopyButton,
  Headline,
  Loader,
  MnemonicWords,
  Paragraph,
  PrimaryButton,
  Row,
  SafeLayout,
  Text,
} from "@/components";
import { addSkipButton } from "@/navigation/header/NewWalletHeader";
import { Wallet, useAccountsStore, useModalStore } from "@/store";
import { Colors, FontWeights } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Clipboard from "expo-clipboard";
import { SecuritySafe } from "iconsax-react-native";
import { default as React, useEffect, useState } from "react";
import { View } from "react-native";
import { storeNewAccount } from "./storeNewAccount";

type GenerateWalletProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Generate Wallet"
>;

export default function GenerateWalletScreen({
  navigation,
  route,
}: GenerateWalletProps) {
  const accountsStore = useAccountsStore();
  const { alert } = useModalStore();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    accountsStore.generateWallet().then(setWallet);
  }, [accountsStore]);

  useEffect(() => {
    if (wallet) {
      addSkipButton(navigation, onSkip);
    }
  }, [wallet, navigation]);

  async function onSkip() {
    if (copied) {
      Clipboard.setStringAsync(""); // Clear the clipboard just in case it was copied
    }
    await storeNewAccount(
      accountsStore,
      navigation,
      wallet!,
      true,
      route.params?.name,
    );
  }

  function onCopy() {
    setCopied(true);
    alert({
      title: "Paste it in safe place",
      description: (
        <>
          <Text style={{ fontFamily: FontWeights.bold, color: Colors.text100 }}>
            Password Manager
          </Text>{" "}
          <Text style={{ color: Colors.text100 }}>
            is a great option. Visiting unsecured sites poses a risk to
            clipboard data.
          </Text>
        </>
      ),
      ok: "Got it",
      icon: SecuritySafe,
    });
  }

  function onNext() {
    if (copied) {
      Clipboard.setStringAsync(""); // Clear the clipboard
    }
    navigation.push("Confirm Mnemonic", { wallet: wallet! });
  }

  return (
    <SafeLayout staticView={true}>
      {!wallet ? (
        <Row style={{ justifyContent: "center" }}>
          <Loader />
        </Row>
      ) : (
        <Column style={{ height: "100%", justifyContent: "space-between" }}>
          <View>
            <View style={{ marginBottom: 20 }}>
              <Headline>Secret Recovery Phrase</Headline>
              <Paragraph style={{ textAlign: "center", marginBottom: 32 }}>
                Save these 12 words in a secure location, such as a password
                manager, and never share them with anyone.
              </Paragraph>

              <MnemonicWords mnemonic={wallet.mnemonic.split(" ")} />
            </View>

            <CopyButton
              title="Copy to clipboard"
              titleColor={Colors.text100}
              toCopy={wallet!.mnemonic}
              onCopy={onCopy}
            />
          </View>
          <PrimaryButton title="OK, stored safely" onPress={onNext} />
        </Column>
      )}
    </SafeLayout>
  );
}
