import { Colors, FontSizes, FontWeights } from "@/styles";
import { Pressable } from "react-native";
import { Column, Row } from "../layout";
import { Paragraph, Text } from "../typography";
import RadioMarker from "./RadioMarker";

type RadioProps<T extends string> = {
  title: T;
  subtitle?: string;
  description?: string;
  isActive: boolean;
  onPress: (option: T) => void;
};

export default function Radio<T extends string>({
  title,
  subtitle,
  description,
  isActive,
  onPress,
}: RadioProps<T>) {
  function onRadioPress() {
    if (isActive) {
      return;
    }
    onPress(title);
  }

  return (
    <Pressable
      style={{
        backgroundColor: Colors.background100,
        paddingHorizontal: 22,
        paddingVertical: 16,
      }}
      onPress={onRadioPress}
    >
      <Row>
        <Column style={{ gap: 4 }}>
          <Row style={{ justifyContent: "flex-start" }}>
            <Text
              style={{ fontSize: FontSizes.base, fontFamily: FontWeights.bold }}
            >
              {title}
            </Text>
            <Text>({subtitle})</Text>
          </Row>
          {description && (
            <Paragraph style={{ maxWidth: 235 }}>{description}</Paragraph>
          )}
        </Column>
        <RadioMarker filled={isActive} />
      </Row>
    </Pressable>
  );
}
