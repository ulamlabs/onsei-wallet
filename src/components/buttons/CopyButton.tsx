import { Colors, FontSizes, FontWeights } from "@/styles";
import * as Clipboard from "expo-clipboard";
import { Copy, TickCircle } from "iconsax-react-native";
import React, { useState } from "react";
import { StyleProp, ViewStyle } from "react-native";
import TertiaryButton from "./TertiaryButton";

type Props = {
  title: string;
  titleColor?: string;
  toCopy: string;
  onCopy?: () => any;
  asyncCopy?: () => Promise<boolean>;
  style?: StyleProp<ViewStyle>;
};

export default function CopyButton({
  title,
  titleColor = Colors.text,
  toCopy,
  onCopy,
  style,
  asyncCopy,
}: Props) {
  const [copied, setCopied] = useState(false);

  async function onAsyncCopy() {
    const yesno = await asyncCopy!();
    if (yesno) {
      onPress();
    }
  }

  function onPress() {
    Clipboard.setStringAsync(toCopy);
    setCopied(true);
    if (onCopy) {
      onCopy();
    }
    setTimeout(() => {
      setCopied(false);
    }, 5000);
  }

  if (copied) {
    return (
      <TertiaryButton
        style={style}
        title="Copied"
        icon={TickCircle}
        iconColor={Colors.success}
        iconVariant="Bold"
        textStyle={{ fontSize: FontSizes.sm, fontFamily: FontWeights.bold }}
        onPress={() => {}}
      />
    );
  }

  return (
    <TertiaryButton
      style={style}
      title={title}
      icon={Copy}
      color={titleColor}
      textStyle={{
        fontSize: FontSizes.sm,
        fontFamily: FontWeights.bold,
      }}
      onPress={asyncCopy ? onAsyncCopy : onPress}
    />
  );
}
