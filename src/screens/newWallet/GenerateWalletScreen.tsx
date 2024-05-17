import {
  Column,
  Headline,
  Loader,
  MnemonicWords,
  Paragraph,
  PrimaryButton,
  Row,
  SafeLayout,
  TertiaryButton,
  Text,
} from "@/components";
import { addSkipButton } from "@/navigation/header/NewWalletHeader";
import { Wallet, useAccountsStore, useModalStore } from "@/store";
import { Colors, FontWeights } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Clipboard from "expo-clipboard";
import {
  Copy as ClipboardCopy,
  SecuritySafe,
  TickCircle,
} from "iconsax-react-native";
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
    Clipboard.setStringAsync(wallet!.mnemonic);
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
    <SafeLayout noScroll={true}>
      {!wallet ? (
        <Loader />
      ) : (
        <Column style={{ height: "100%", justifyContent: "space-between" }}>
          <View>
            <View>
              <Headline>Secret Recovery Phrase</Headline>
              <Paragraph style={{ textAlign: "center", marginBottom: 32 }}>
                Save these 12 words in a secure location, such as a password
                manager, and never share them with anyone.
              </Paragraph>

              <MnemonicWords mnemonic={wallet.mnemonic.split(" ")} />
            </View>
            {copied ? (
              <View style={{ marginTop: 20, alignItems: "center" }}>
                <Row style={{ maxWidth: "auto" }}>
                  <TickCircle size={16} variant="Bold" color={Colors.success} />
                  <Text style={{ fontFamily: FontWeights.bold }}>Copied</Text>
                </Row>
              </View>
            ) : (
              <TertiaryButton
                title="Copy to clipboard"
                icon={ClipboardCopy}
                color={Colors.text100}
                textStyle={{ fontSize: 14 }}
                onPress={onCopy}
              />
            )}
          </View>
          <PrimaryButton title="OK, stored safely" onPress={onNext} />
        </Column>
      )}
    </SafeLayout>
  );
}
