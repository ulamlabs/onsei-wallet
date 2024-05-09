import {
  Column,
  Headline,
  Paragraph,
  PrimaryButton,
  SafeLayout,
} from "@/components";
import { useAccountsStore } from "@/store";
import * as Clipboard from "expo-clipboard";
import { Clipboard as ClipboardImg, ClipboardTick } from "iconsax-react-native";
import { useState } from "react";
import { View } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function ReceiveAssets() {
  const { activeAccount } = useAccountsStore();

  const [addressCopied, setAddressCopied] = useState(false);

  function onCopy() {
    Clipboard.setStringAsync(activeAccount?.address ?? "");
    setAddressCopied(true);
    setTimeout(() => {
      setAddressCopied(false);
    }, 10000);
  }

  if (!activeAccount) {
    return <></>;
  }

  return (
    <SafeLayout>
      <Column style={{ alignItems: "center" }}>
        <Headline>Receive Assets</Headline>

        <View style={{ padding: 30, margin: 30, backgroundColor: "white" }}>
          <QRCode value={activeAccount.address} size={200} />
        </View>

        <Paragraph>{activeAccount.address}</Paragraph>

        <PrimaryButton
          title={addressCopied ? "Copied successfully" : "Copy address"}
          onPress={onCopy}
          icon={addressCopied ? ClipboardTick : ClipboardImg}
        />
      </Column>
    </SafeLayout>
  );
}
