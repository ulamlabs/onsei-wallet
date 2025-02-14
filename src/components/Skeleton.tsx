import { useEffect, useRef } from "react";
import {
  StyleSheet,
  ViewProps,
  DimensionValue,
  Animated,
  Easing,
} from "react-native";

const MIN_OPACITY = 0.3;
const MAX_OPACITY = 0.1;

type SkeletonProps = ViewProps & {
  width?: DimensionValue;
  height?: DimensionValue;
  style?: ViewProps["style"];
};

export const Skeleton = ({
  width = "100%",
  height = 100,
  style,
  ...props
}: SkeletonProps) => {
  const opacity = useRef(new Animated.Value(MIN_OPACITY)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: MAX_OPACITY,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: MIN_OPACITY,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    return () => {
      opacity.stopAnimation();
    };
  }, []);

  return (
    <Animated.View
      style={[styles.skeleton, { width, height, opacity }, style]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: `rgba(255, 255, 255, ${MIN_OPACITY})`,
    borderRadius: 4,
  },
});
