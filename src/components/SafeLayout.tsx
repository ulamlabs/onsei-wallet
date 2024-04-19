import React, { PropsWithChildren } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ViewStyle,
  View,
} from "react-native";
import { scale, verticalScale } from "@/utils";
import tw from "@/lib/tailwind";

// Layout with safe paddings that ensure that content won't be hidden behind phone elements (like front camera)
export default ({ children }: PropsWithChildren) => {
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
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={{ minHeight: "100%" }}
      >
        <View style={layoutStyle}>{children}</View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
