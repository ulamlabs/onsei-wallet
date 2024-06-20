import { Row, Text } from "@/components";
import { FontSizes, FontWeights } from "@/styles";
import { StyleProp, ViewStyle } from "react-native";

export default function DefaultHeaderTitle({
  title,
  style,
}: {
  title: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Row style={{ minWidth: "100%" }}>
      <Text
        style={[
          { fontSize: FontSizes.lg, fontFamily: FontWeights.bold },
          style,
        ]}
      >
        {title}
      </Text>
    </Row>
  );
}
