import { Colors, FontWeights } from "@/styles";
import { isCorrectAddress, trimAddress } from "@/utils";
import * as Clipboard from "expo-clipboard";
import React, { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import Box from "./Box";
import { Text } from "./typography";

type Props = {
  onPaste: (content: string) => any;
};

export default function ClipboardAddressBox({ onPaste }: Props) {
  const [clipboardContent, setClipboardContent] = useState("");

  useEffect(() => {
    getContent();
  }, []);

  async function getContent() {
    const copied = await Clipboard.getStringAsync();
    if (isCorrectAddress(copied)) {
      setClipboardContent(copied);
    }
  }

  if (!clipboardContent) {
    return <></>;
  }

  return (
    <Pressable onPress={() => onPaste(clipboardContent)}>
      <Box>
        <View>
          <Text style={{ color: Colors.text100 }}>Paste from clipboard</Text>
          <Text style={{ fontFamily: FontWeights.bold }}>
            {trimAddress(clipboardContent)}
          </Text>
        </View>
      </Box>
    </Pressable>
  );
}
