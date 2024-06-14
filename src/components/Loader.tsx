import { Colors } from "@/styles";
import { useEffect, useState } from "react";
import { Animated } from "react-native";
import { Path, Svg } from "react-native-svg";

type LoaderSizes = "small" | "medium" | "base" | "big" | "large";

type LoaderProps = {
  size?: LoaderSizes;
  color?: string;
  systemLoader?: boolean;
};

const SIZE_TO_PX: Record<LoaderSizes, number> = {
  small: 16,
  medium: 24,
  base: 40,
  big: 50,
  large: 96,
};

export default function Loader({
  size = "base",
  color = Colors.text,
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

  return (
    <Animated.View
      style={{
        transform: [{ rotate: spin }],
        aspectRatio: 1,
        width: SIZE_TO_PX[size],
        height: SIZE_TO_PX[size],
      }}
    >
      <Svg width="100%" height="100%" fill="none" viewBox="0 0 97 96">
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
