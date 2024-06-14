import { Colors } from "@/styles";
import { PropsWithChildren } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Row } from "./layout";

type Props = PropsWithChildren & {
  style?: StyleProp<ViewStyle>;
};

export default function Box({ children, style }: Props) {
  return (
    <Row
      style={[
        {
          backgroundColor: Colors.background200,
          padding: 5,
          borderRadius: 22,
          alignItems: "center",
          paddingHorizontal: 22,
          paddingVertical: 16,
          gap: 15,
        },
        style,
      ]}
    >
      {children}
    </Row>
  );
}
