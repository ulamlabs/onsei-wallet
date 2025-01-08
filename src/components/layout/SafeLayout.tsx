import { useToastStore } from "@/store";
import { Colors } from "@/styles";
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
import { useSafeLayoutPaddings } from "./";

type LayoutProps = PropsWithChildren & {
  staticView?: boolean;
  refreshFn?: () => any;
  style?: StyleProp<ViewStyle>;
  scrollEnabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
};

// Layout with safe paddings that ensure that content won't be hidden behind phone elements (like front camera)
export default function SafeLayout({
  children,
  staticView,
  refreshFn,
  style,
  scrollEnabled = true,
  containerStyle,
}: LayoutProps) {
  const [refreshing, setRefreshing] = useState(false);
  const layoutPaddings = useSafeLayoutPaddings();
  const layoutStyle: ViewStyle = {
    minHeight: "100%",
    ...layoutPaddings,
  };
  const { error } = useToastStore();
  const navigation = useNavigation();

  const onRefresh = useCallback(async () => {
    if (!refreshFn) {
      return;
    }

    setRefreshing(true);
    try {
      await refreshFn();
    } catch (e: any) {
      console.error(e);
      error({ description: "Something went wrong while refreshing" });
    } finally {
      setRefreshing(false);
    }
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[
        { backgroundColor: Colors.background, minHeight: "100%", flexGrow: 1 },
        containerStyle,
      ]}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 50}
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
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: navigation.getId && navigation.getId() ? 0 : 128,
            }}
            keyboardShouldPersistTaps="handled"
            scrollEnabled={scrollEnabled}
            testID="safe-layout-scroll-view"
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
