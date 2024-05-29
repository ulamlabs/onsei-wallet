import { Colors } from "@/styles";
import { useEffect, useState } from "react";
import { ActivityIndicator, Animated } from "react-native";
import { Path, Svg } from "react-native-svg";

type LoaderSizes = "small" | "medium" | "large" | "base";

type LoaderProps = {
  size?: LoaderSizes;
  color?: string;
  systemLoader?: boolean;
};

const SIZE_TO_PX: Record<LoaderSizes, number> = {
  small: 16,
  medium: 24,
  base: 40,
  large: 96,
};

export default function Loader({
  size = "base",
  color = Colors.text,
  systemLoader = true,
}: LoaderProps) {
  const [rotation] = useState(new Animated.Value(0));

  useEffect(() => {
    const rotateAnimation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    );

    rotateAnimation.start();
    return () => rotateAnimation.stop();
  }, []);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return systemLoader ? (
    <ActivityIndicator size={SIZE_TO_PX[size]} color={color} />
  ) : (
    <Animated.View style={{ transform: [{ rotate: spin }] }}>
      <Svg width={SIZE_TO_PX[size]} height={SIZE_TO_PX[size]} fill="none">
        <Path
          stroke={color}
          strokeLinecap="round"
          strokeWidth={8}
          d="M92.5 48a44 44 0 0 0-18.137-35.597"
        />
      </Svg>
    </Animated.View>
  );
}
