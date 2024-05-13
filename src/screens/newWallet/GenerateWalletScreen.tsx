import {
  Headline,
  Loader,
  MnemonicWords,
  Paragraph,
  PrimaryButton,
  SafeLayout,
  TertiaryButton,
} from "@/components";
import * as Clipboard from "expo-clipboard";
import { Copy as ClipboardCopy, SecuritySafe } from "iconsax-react-native";
import { Wallet, useAccountsStore, useModalStore } from "@/store";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { default as React, ReactElement, useEffect, useState } from "react";
import { Colors } from "@/styles";
import { addSkipButton } from "@/navigation/header/NewWalletHeader";
import { storeNewAccount } from "./storeNewAccount";

type GenerateWalletProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Generate Wallet"
>;

export default function GenerateWalletScreen({
  navigation,
}: GenerateWalletProps) {
  const accountsStore = useAccountsStore();
  const { alert } = useModalStore();
  const [wallet, setWallet] = useState<Wallet | null>(null);

  useEffect(() => {
    accountsStore.generateWallet().then(setWallet);
  }, [accountsStore]);

  useEffect(() => {
    if (wallet) {
      addSkipButton(navigation, onSkip);
    }
  }, [wallet, navigation]);

  async function onSkip() {
    Clipboard.setStringAsync(""); // Clear the clipboard just in case it was copied
    await storeNewAccount(accountsStore, navigation, wallet!, true);
  }

  function onCopy() {
    Clipboard.setStringAsync(wallet!.mnemonic);
    alert({
      title: "Paste it in safe place",
      description:
        "Password Manager is a great option. Visiting unsecured sites poses a risk to clipboard data.",
      ok: "Got it",
      icon: SecuritySafe,
    });
  }

  function onNext() {
    Clipboard.setStringAsync(""); // Clear the clipboard
    navigation.push("Confirm Mnemonic", { wallet: wallet! });
  }

  function getContent(): ReactElement {
    if (!wallet) {
      return <Loader />;
    }

    return (
      <>
        <MnemonicWords mnemonic={wallet.mnemonic.split(" ")} />

        <TertiaryButton
          title="Copy to clipboard"
          icon={ClipboardCopy}
          color={Colors.text100}
          textStyle={{ fontSize: 14 }}
          onPress={onCopy}
        />
        <PrimaryButton
          title="OK, stored safely"
          style={{ marginTop: "auto" }}
          textStyle={{ fontSize: 16 }}
          onPress={onNext}
        />
      </>
    );
  }

  return (
    <SafeLayout>
      <Headline>Secret Recovery Phrase</Headline>
      <Paragraph style={{ textAlign: "center", marginBottom: 32 }}>
        Save these 12 words in a secure location, such as a password manager,
        and never share them with anyone.
      </Paragraph>

      {getContent()}
    </SafeLayout>
  );
}
