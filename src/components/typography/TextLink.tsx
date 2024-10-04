import { Colors, FontWeights } from "@/styles";
import { Linking, Pressable } from "react-native";
import Paragraph from "./Paragraph";

type Props = {
  url: string;
  text: string;
};

export default function TextLink({ url, text }: Props) {
  async function openUrl() {
    await Linking.openURL(url);
  }
  return (
    <Pressable style={{}} onPress={openUrl}>
      <Paragraph
        style={[
          {
            fontFamily: FontWeights.bold,
            color: Colors.markerBackground,
            margin: 0,
          },
        ]}
      >
        {text}
      </Paragraph>
    </Pressable>
  );
}
