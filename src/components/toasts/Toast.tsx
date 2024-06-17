import { Toasts } from "@/store";
import { Colors, FontWeights } from "@/styles";
import { PropsWithChildren, useEffect, useRef } from "react";
import { Animated, Pressable, StyleProp, View, ViewStyle } from "react-native";
import { Path, Svg } from "react-native-svg";
import { Row } from "../layout";
import { Text } from "../typography";

type Props = PropsWithChildren & {
  style?: StyleProp<ViewStyle>;
  toast: Toasts;
  duration?: number;
  icon: JSX.Element;
  textColor?: string;
};

export default function Toast({
  children,
  style,
  toast,
  icon,
  textColor,
  duration,
}: Props) {
  const translateY = useRef(new Animated.Value(200)).current;

  useEffect(() => {
    const id = setTimeout(() => {
      hideToast();
    }, duration || 5000);
    return () => clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  function hideToast() {
    Animated.timing(translateY, {
      toValue: 200,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      toast.resolve();
    });
  }

  return (
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
        <View style={[{ maxWidth: "70%" }]}>
          <Row>
            <Row style={{ gap: 10 }}>
              {icon}
              <Text
                style={{
                  color: textColor || Colors.toastInfoText,
                  fontFamily: FontWeights.medium,
                }}
              >
                {children}
              </Text>
            </Row>
          </Row>
        </View>
        <Pressable onPress={hideToast}>
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
  );
}
