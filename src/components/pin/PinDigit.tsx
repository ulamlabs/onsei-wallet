import tw from "@/lib/tailwind";
import { useEffect, useRef } from "react";
import { View, Animated, Easing } from "react-native";

export type PinDigitProps = {
  filled: boolean;
  error: boolean;
};

const NOT_FILLED_SIZE = 8;
const FILLED_SIZE = 20;

export default function PinDigit({ filled, error }: PinDigitProps) {
  const animation = useRef(new Animated.Value(NOT_FILLED_SIZE)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: filled ? NOT_FILLED_SIZE : FILLED_SIZE,
      duration: 250,
      useNativeDriver: false,
      easing: Easing.elastic(1.8),
    }).start();
  }, [filled, animation]);

  return (
    <View
      style={{
        height: 20,
        width: 20,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Animated.View
        style={{
          borderRadius: 100,
          backgroundColor: tw.color(error ? "danger-400" : "white"),
          width: animation,
          height: animation,
        }}
      />
    </View>
  );
}
