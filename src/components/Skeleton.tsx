import { useEffect, useRef } from "react";
import {
  StyleSheet,
  ViewProps,
  DimensionValue,
  Animated,
  Easing,
} from "react-native";

const ANIMATION_CONFIG = {
  duration: 1000,
  minOpacity: 0.3,
  maxOpacity: 0.1,
} as const;

type SkeletonProps = ViewProps & {
  width?: DimensionValue;
  height?: DimensionValue;
};

const createSkeletonAnimation = (opacity: Animated.Value) => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: ANIMATION_CONFIG.maxOpacity,
        duration: ANIMATION_CONFIG.duration,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: ANIMATION_CONFIG.minOpacity,
        duration: ANIMATION_CONFIG.duration,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]),
  );
};

export default function Skeleton({
  width = "100%",
  height = 100,
  style,
  ...props
}: SkeletonProps) {
  const opacity = useRef(
    new Animated.Value(ANIMATION_CONFIG.minOpacity),
  ).current;

  useEffect(() => {
    const animation = createSkeletonAnimation(opacity);
    animation.start();

    return () => {
      animation.stop();
      opacity.stopAnimation();
    };
  }, [opacity]);

  return (
    <Animated.View
      style={[styles.skeleton, { width, height, opacity }, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: `rgba(255, 255, 255, ${ANIMATION_CONFIG.minOpacity})`,
    borderRadius: 4,
  },
});
