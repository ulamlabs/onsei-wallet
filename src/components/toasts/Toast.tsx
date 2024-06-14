import { Colors } from "@/styles";
import { PropsWithChildren, useEffect, useRef } from "react";
import { Animated, Pressable, SafeAreaView } from "react-native";

type Props = PropsWithChildren & {
  isVisible: boolean;
  position?: "top" | "bottom";
  transparentBg?: boolean;
};

export default function Toast({
  isVisible,
  children,
  position = "bottom",
  transparentBg,
}: Props) {
  const translateY = useRef(new Animated.Value(200)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: isVisible ? 0 : position === "bottom" ? 200 : -200,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);
  return (
    <SafeAreaView
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Pressable>
        <Animated.View
          style={{
            backgroundColor: transparentBg ? "" : Colors.background,
            padding: 10,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            transform: [{ translateY }],
            borderColor: transparentBg ? "" : Colors.inputBorderColor,
            borderTopWidth: 2,
            borderLeftWidth: 2,
            borderRightWidth: 2,
          }}
        >
          {children}
        </Animated.View>
      </Pressable>
    </SafeAreaView>
  );
}
