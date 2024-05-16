import { AccountProps } from "@/screens/WalletOverview/Account";
import { Colors } from "@/styles";
import { trimAddress } from "@/utils";
import * as Clipboard from "expo-clipboard";
import { Copy as CopyIcon, TickCircle } from "iconsax-react-native";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Row } from "./layout";
import { Headline, Paragraph } from "./typography";

export default function CopyAddressItem({ item }: AccountProps) {
  const [clicked, setClicked] = useState(false);
  const onPress = () => {
    if (clicked) {
      return;
    }
    setClicked(true);
    Clipboard.setStringAsync(item.address);
    setTimeout(() => {
      setClicked(false);
    }, 1000);
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <Row>
        <View style={{ alignItems: "flex-start" }}>
          <Headline size="base" style={{ marginBottom: 0 }}>
            {item.name}
          </Headline>
          <Paragraph>{trimAddress(item.address)}</Paragraph>
        </View>
        {clicked ? (
          <TickCircle variant="Bold" color={Colors.success} />
        ) : (
          <CopyIcon color={Colors.text100} />
        )}
      </Row>
    </TouchableOpacity>
  );
}
