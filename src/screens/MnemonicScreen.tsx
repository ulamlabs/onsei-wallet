import {
  Column,
  CopyButton,
  Loader,
  MnemonicWords,
  Paragraph,
  PrimaryButton,
  SafeLayout,
} from "@/components";
import { useCopyAlert } from "@/hooks";
import { useAccountsStore } from "@/store";
import { Colors } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Clipboard from "expo-clipboard";
import { useEffect, useState } from "react";
import { View } from "react-native";

type Props = NativeStackScreenProps<
  NavigatorParamsList,
  "Your unique Recovery Phrase"
>;

export default function MnemonicScreen({
  route: {
    params: { address, needsConfirmation },
  },
  navigation,
}: Props) {
  const { getMnemonic } = useAccountsStore();
  const [mnemonic, setMnemonic] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const showCopyAlert = useCopyAlert();

  useEffect(() => {
    setMnemonic(getMnemonic(address).split(" "));
    return () => {
      setMnemonic([]);
      Clipboard.setStringAsync("");
    };
  }, [address, getMnemonic]);

  function onCopy() {
    setCopied(true);
    showCopyAlert();
  }

  function onDone() {
    if (copied) {
      Clipboard.setStringAsync(""); // Clear the clipboard
    }
    if (needsConfirmation) {
      navigation.navigate("Confirm Mnemonic", {
        wallet: { mnemonic: mnemonic.join(" "), address },
        backup: true,
      });
    } else {
      navigation.goBack();
    }
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
          <PrimaryButton
            title={needsConfirmation ? "OK, stored safely" : "Done"}
            onPress={onDone}
          />
        </Column>
      ) : (
        <Loader />
      )}
    </SafeLayout>
  );
}
