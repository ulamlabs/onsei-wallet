import Button from "@/components/Button";
import SafeLayout from "@/components/SafeLayout";
import tw from "@/lib/tailwind";
import { useAccountsStore } from "@/store";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Clipboard from "expo-clipboard";
import { Clipboard as ClipboardImg, ClipboardTick } from "iconsax-react-native";
import { useState } from "react";
import { Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

type ReceiveAssetsProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Receive"
>;

export default ({}: ReceiveAssetsProps) => {
  const { activeAccount } = useAccountsStore();

  const [addressCopied, setAddressCopied] = useState(false);

  function onCopy() {
    Clipboard.setStringAsync(activeAccount?.address!);
    setAddressCopied(true);
    setTimeout(() => {
      setAddressCopied(false);
    }, 10000);
  }
  return (
    <SafeLayout>
      <View style={tw`items-center`}>
        <Text style={tw`title`}>RECEIVE ASSETS</Text>

        <View style={tw`items-center bg-white p-5`}>
          <QRCode value={activeAccount?.address!} size={200} />
        </View>

        <Text style={tw`text-basic-600 text-xs mt-4 mb-5`}>
          {activeAccount?.address!}
        </Text>

        <Button
          onPress={onCopy}
          icon={
            addressCopied ? (
              <ClipboardTick style={tw`mr-3`} color="white" />
            ) : (
              <ClipboardImg style={tw`mr-3`} color="white" />
            )
          }
          label={addressCopied ? "Copied successfully" : "Copy address"}
        />
      </View>
    </SafeLayout>
  );
};
