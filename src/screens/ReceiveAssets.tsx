import {
  Column,
  Headline,
  Paragraph,
  PrimaryButton,
  SafeLayout,
  SecondaryButton,
} from "@/components";
import { useAccountsStore } from "@/store";
import { Colors } from "@/styles";
import { NavigatorParamsList } from "@/types";
import { trimAddress } from "@/utils";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Clipboard from "expo-clipboard";
import { Copy, TickCircle } from "iconsax-react-native";
import { useState } from "react";
import { View } from "react-native";
import QRCode from "react-native-qrcode-svg";

type Props = NativeStackScreenProps<NavigatorParamsList, "Your SEI address">;

export default function ReceiveAssets({ navigation }: Props) {
  const { activeAccount } = useAccountsStore();

  const [addressCopied, setAddressCopied] = useState(false);

  function onCopy() {
    Clipboard.setStringAsync(activeAccount?.address ?? "");
    setAddressCopied(true);
    setTimeout(() => {
      setAddressCopied(false);
    }, 2000);
  }

  if (!activeAccount) {
    return <></>;
  }

  return (
    <SafeLayout>
      <Column
        style={{ gap: 0, justifyContent: "space-between", height: "100%" }}
      >
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              padding: 12,
              marginBottom: 24,
              backgroundColor: Colors.text,
              borderRadius: 23,
            }}
          >
            <QRCode value={activeAccount.address} size={220} />
          </View>
          <Headline>Your SEI address</Headline>
          <Paragraph size="base">
            Use this address to receive tokens on SEI
          </Paragraph>
        </View>
        <View style={{ gap: 12 }}>
          <SecondaryButton
            title={
              addressCopied ? "Copied" : trimAddress(activeAccount.address)
            }
            onPress={onCopy}
            iconColor={addressCopied ? Colors.success : Colors.text}
            iconVariant={addressCopied ? "Bold" : "Linear"}
            icon={addressCopied ? TickCircle : Copy}
          />
          <PrimaryButton title="Done" onPress={() => navigation.goBack()} />
        </View>
      </Column>
    </SafeLayout>
  );
}
