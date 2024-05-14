import { AccountProps } from "@/screens/WalletOverview/Account";
import { Colors } from "@/styles";
import { trimAddress } from "@/utils";
import { Copy as CopyIcon, TickCircle } from "iconsax-react-native";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Headline, Paragraph } from "./typography";

export default function CopyAddressItem({ item }: AccountProps) {
  const [clicked, setClicked] = useState(false);
  const onPress = () => {
    setClicked(true);
    setTimeout(() => {
      setClicked(false);
    }, 1000);
  };
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      onPress={onPress}
    >
      <View style={{ alignItems: "flex-start" }}>
        <Headline size="base" style={{ marginBottom: 0 }}>
          {item.name}
        </Headline>
        <Paragraph>{trimAddress(item.address)}</Paragraph>
      </View>
      {clicked ? (
        <TickCircle variant="Bold" color="#3E925A" />
      ) : (
        <CopyIcon color={Colors.text100} />
      )}
    </TouchableOpacity>
  );
}
