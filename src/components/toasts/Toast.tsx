import { Toasts } from "@/store";
import { Colors } from "@/styles";
import { scale } from "@/utils";
import { PropsWithChildren, useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  SafeAreaView,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Path, Svg } from "react-native-svg";
import { Row } from "../layout";

type Props = PropsWithChildren & {
  isVisible: boolean;
  style?: StyleProp<ViewStyle>;
  toast: Toasts;
};

export default function Toast({ isVisible, children, style, toast }: Props) {
  const translateY = useRef(new Animated.Value(200)).current;

  useEffect(() => {
    const id = setTimeout(() => {
      toast.resolve();
    }, 5000);
    return () => clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: isVisible ? 0 : 200,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView
      style={{
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        bottom: 110,
        left: Math.max(scale(16), insets.left),
        right: Math.max(scale(16), insets.right),
      }}
    >
      <Animated.View
        style={[
          {
            backgroundColor: Colors.toastBackground,
            padding: 22,
            borderRadius: 22,
            width: "100%",
            transform: [{ translateY }],
            borderColor: Colors.toastBorder,
            borderWidth: 1,
          },
          style,
        ]}
      >
        <Row>
          <View style={{ maxWidth: "70%" }}>{children}</View>
          <Pressable onPress={() => toast.resolve()}>
            <Svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <Path
                d="M0.999512 1L12.9995 13"
                stroke={Colors.text}
                strokeWidth="1.28571"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M0.998047 13L12.998 1"
                stroke={Colors.text}
                strokeWidth="1.28571"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </Pressable>
        </Row>
      </Animated.View>
    </SafeAreaView>
  );
}
