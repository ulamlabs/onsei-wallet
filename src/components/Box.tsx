import { Colors } from "@/styles";
import { PropsWithChildren } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Row } from "./layout";

export type BoxProps = PropsWithChildren & {
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export default function Box({ children, style, testID }: BoxProps) {
  return (
    <Row
      testID={testID}
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
