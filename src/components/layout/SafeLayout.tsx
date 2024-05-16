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
  noScroll?: boolean;
  refreshFn?: () => any;
  style?: StyleProp<ViewStyle>;
};

// Layout with safe paddings that ensure that content won't be hidden behind phone elements (like front camera)
export default function SafeLayout({
  children,
  noScroll,
  refreshFn,
  style,
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
    layoutStyle.paddingBottom = (layoutStyle.paddingBottom as number) + 150; // Height of BottomBarsNavigator
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
    >
      {noScroll ? (
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
