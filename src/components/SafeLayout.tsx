import tw from "@/lib/tailwind";
import { scale, verticalScale } from "@/utils";
import React, { PropsWithChildren } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type LayoutProps = PropsWithChildren & { noScroll?: boolean };

// Layout with safe paddings that ensure that content won't be hidden behind phone elements (like front camera)
export default function SafeLayout({ children, noScroll }: LayoutProps) {
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
      style={tw`bg-background`}
    >
      {noScroll ? (
        <View style={[tw`bg-background`, layoutStyle]}>{children}</View>
      ) : (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={{ minHeight: "100%" }}
        >
          <View style={layoutStyle}>{children}</View>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}
