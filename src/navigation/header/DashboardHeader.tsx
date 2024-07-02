import { Row } from "@/components";
import { Colors } from "@/styles";
import { scale, verticalScale } from "@/utils";
import { PropsWithChildren } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = PropsWithChildren & {
  style?: StyleProp<ViewStyle>;
};

export default function DashboardHeader({ children, style }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Row
      style={[
        {
          width: "100%",
          paddingTop: Math.max(verticalScale(50), insets.top),
          backgroundColor: Colors.background,
          paddingLeft: Math.max(scale(16), insets.left),
          paddingRight: Math.max(scale(16), insets.right),
        },
        style,
      ]}
    >
      {children}
    </Row>
  );
}
