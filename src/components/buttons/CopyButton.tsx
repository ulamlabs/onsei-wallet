import { Colors, FontSizes, FontWeights } from "@/styles";
import * as Clipboard from "expo-clipboard";
import { Copy, TickCircle } from "iconsax-react-native";
import React, { useState } from "react";
import TertiaryButton from "./TertiaryButton";

type Props = {
  title: string;
  titleColor?: string;
  toCopy: string;
  onCopy?: () => any;
};

export default function CopyButton({
  title,
  titleColor = Colors.text,
  toCopy,
  onCopy,
}: Props) {
  const [copied, setCopied] = useState(false);

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
      title={title}
      icon={Copy}
      color={titleColor}
      textStyle={{
        fontSize: FontSizes.sm,
        fontFamily: FontWeights.bold,
      }}
      onPress={onPress}
    />
  );
}
