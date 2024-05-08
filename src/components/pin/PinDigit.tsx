import { Colors } from "@/styles";
import { useEffect, useRef } from "react";
import { View, Animated } from "react-native";

export type PinDigitProps = {
  filled: boolean;
  error: boolean;
};

const SIZE = 22;

export default function PinDigit({ filled, error }: PinDigitProps) {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(scale, {
      toValue: filled ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [filled, scale]);

  return (
    <View
      style={{
        height: SIZE,
        width: SIZE,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        borderWidth: 1,
        borderColor: error ? Colors.danger : Colors.text,
        borderRadius: 8,
      }}
    >
      <Animated.View
        style={{
          borderRadius: 100,
          backgroundColor: error ? Colors.danger : Colors.text,
          width: SIZE + 2,
          height: SIZE + 2,
          transform: [{ scale }],
        }}
      />
    </View>
  );
}
