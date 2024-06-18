import { Colors } from "@/styles";
import { NavigationProp } from "@/types";
import { scale, verticalScale } from "@/utils";
import { useNavigation } from "@react-navigation/native";
import React, { PropsWithChildren, useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type LayoutProps = PropsWithChildren & {
  staticView?: boolean;
  refreshFn?: () => any;
  style?: StyleProp<ViewStyle>;
  scrollEnabled?: boolean;
};

// Layout with safe paddings that ensure that content won't be hidden behind phone elements (like front camera)
export default function SafeLayout({
  children,
  staticView,
  refreshFn,
  style,
  scrollEnabled = true,
}: LayoutProps) {
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const layoutStyle: ViewStyle = {
    minHeight: "100%",
    paddingTop: verticalScale(24), // No need for insets at the top, beacuse header handles it
    paddingBottom: Math.max(verticalScale(50), insets.bottom),
    paddingLeft: Math.max(scale(16), insets.left),
    paddingRight: Math.max(scale(16), insets.right),
  };
  if (!navigation.getId()) {
    // No ID means we're in the BottomBarsNavigation, which can overlay content
    (layoutStyle.paddingTop = Math.max(verticalScale(50), insets.top)),
      (layoutStyle.paddingBottom = 0); // This value works on emulators and physical devices
  }

  const onRefresh = useCallback(async () => {
    if (!refreshFn) {
      return;
    }

    setRefreshing(true);
    try {
      await refreshFn();
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ backgroundColor: Colors.background }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0} // 40 is perfect match for ios offset
    >
      {staticView ? (
        <View
          style={[layoutStyle, { backgroundColor: Colors.background }, style]}
        >
          {children}
        </View>
      ) : (
        <View style={[layoutStyle, style]}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            scrollEnabled={scrollEnabled}
            refreshControl={
              refreshFn && (
                <RefreshControl
                  tintColor={Colors.text}
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              )
            }
            style={{ minHeight: "100%" }}
          >
            {children}
          </ScrollView>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
