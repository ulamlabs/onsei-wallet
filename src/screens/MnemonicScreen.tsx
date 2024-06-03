import {
  Column,
  CopyButton,
  Loader,
  MnemonicWords,
  Paragraph,
  PrimaryButton,
  SafeLayout,
  Text,
} from "@/components";
import { useAccountsStore, useModalStore } from "@/store";
import { Colors, FontWeights } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Clipboard from "expo-clipboard";
import { SecuritySafe } from "iconsax-react-native";
import { useEffect, useState } from "react";
import { View } from "react-native";

type Props = NativeStackScreenProps<
  NavigatorParamsList,
  "Your unique Recovery Phrase"
>;

export default function MnemonicScreen({
  route: {
    params: { address },
  },
  navigation,
}: Props) {
  const { getMnemonic } = useAccountsStore();
  const [mnemonic, setMnemonic] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const { alert } = useModalStore();

  useEffect(() => {
    setMnemonic(getMnemonic(address).split(" "));
    return () => setMnemonic([]);
  }, [address, getMnemonic]);

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

  function onDone() {
    if (copied) {
      Clipboard.setStringAsync(""); // Clear the clipboard
    }
    navigation.goBack();
  }

  return (
    <SafeLayout>
      {mnemonic?.length > 0 ? (
        <Column style={{ minHeight: "100%", justifyContent: "space-between" }}>
          <View>
            <Paragraph style={{ marginBottom: 30, textAlign: "center" }}>
              Don't share this recovery phrase. Anyone with these words can
              access your wallet.
            </Paragraph>

            <MnemonicWords mnemonic={mnemonic} />
            <CopyButton
              style={{ marginTop: 10 }}
              title="Copy to clipboard"
              titleColor={Colors.text100}
              toCopy={mnemonic.join(" ")}
              onCopy={onCopy}
            />
          </View>
          <PrimaryButton title="Done" onPress={onDone} />
        </Column>
      ) : (
        <Loader />
      )}
    </SafeLayout>
  );
}
