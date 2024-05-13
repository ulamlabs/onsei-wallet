import { Colors } from "@/styles";
import { trimAddress } from "@/utils";
import * as ClipboardCopy from "expo-clipboard";
import { Copy, TickCircle } from "iconsax-react-native";
import { useState } from "react";
import { Animated, TouchableOpacity, View } from "react-native";
import { Headline, Paragraph } from "./typography";

type Props = {
  address: string;
};

export default function CopyAddress({ address }: Props) {
  const [visible, setVisible] = useState(false);
  const opacity = useState(new Animated.Value(0))[0];

  function copyAddress() {
    ClipboardCopy.setStringAsync(address);
    setVisible(true);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(({ finished }) => finished && setVisible(false));
    }, 1500);
  }

  return (
    <TouchableOpacity onPress={copyAddress}>
      <Copy size={22} color={Colors.text100} />
      <Animated.View
        style={{
          position: "absolute",
          width: 214,
          transform: [{ translateY: 30 }, { translateX: -204 }],
          backgroundColor: Colors.opacityBackground,
          paddingHorizontal: 16,
          paddingVertical: 12,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderWidth: 1,
          borderColor: Colors.inputBorderColor,
          borderRadius: 12,
          opacity: opacity,
          display: visible ? "flex" : "none",
        }}
      >
        <View>
          <Headline size="h3" style={{ marginBottom: 0 }}>
            Address copied
          </Headline>
          <Paragraph>{trimAddress(address)}</Paragraph>
        </View>
        <TickCircle variant="Bold" color={Colors.checkBackground} />
      </Animated.View>
    </TouchableOpacity>
  );
}
