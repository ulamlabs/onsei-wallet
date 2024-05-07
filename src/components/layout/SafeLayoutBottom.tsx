import { Colors } from "@/styles";
import { scale, verticalScale } from "@/utils";
import { PropsWithChildren } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SafeLayoutBottom({ children }: PropsWithChildren) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        backgroundColor: Colors.background,
        gap: 60,
        justifyContent: "flex-end",
        minHeight: "100%",
        paddingTop: Math.max(verticalScale(10), insets.top),
        paddingBottom: Math.max(verticalScale(50), insets.bottom),
        paddingLeft: Math.max(scale(10), insets.left),
        paddingRight: Math.max(scale(10), insets.right),
      }}
    >
      {children}
    </View>
  );
}
