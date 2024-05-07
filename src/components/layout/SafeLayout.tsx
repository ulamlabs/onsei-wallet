import { Colors } from "@/styles";
import { scale, verticalScale } from "@/utils";
import React, { PropsWithChildren } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type LayoutProps = PropsWithChildren & {
  noScroll?: boolean;
  style?: StyleProp<ViewStyle>;
};

// Layout with safe paddings that ensure that content won't be hidden behind phone elements (like front camera)
export default function SafeLayout({ children, noScroll, style }: LayoutProps) {
  const insets = useSafeAreaInsets();
  const layoutStyle: ViewStyle = {
    flex: 1,
    minHeight: "100%",
    paddingTop: Math.max(verticalScale(10), insets.top),
    paddingBottom: Math.max(verticalScale(50), insets.bottom),
    paddingLeft: Math.max(scale(10), insets.left),
    paddingRight: Math.max(scale(10), insets.right),
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ backgroundColor: Colors.background }}
    >
      {noScroll ? (
        <View
          style={[layoutStyle, { backgroundColor: Colors.background }, style]}
        >
          {children}
        </View>
      ) : (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={{ minHeight: "100%" }}
        >
          <View style={[layoutStyle, style]}>{children}</View>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}
