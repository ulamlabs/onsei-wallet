import { Colors } from "@/styles";
import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

export default function RadioMarker({ filled }: { filled: boolean }) {
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
        height: 22,
        width: 22,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        borderWidth: 1,
        borderColor: Colors.text,
        borderRadius: 100,
      }}
    >
      <Animated.View
        style={{
          borderRadius: 100,
          backgroundColor: Colors.text,
          width: 15,
          height: 15,
          transform: [{ scale }],
        }}
      />
    </View>
  );
}
