import { Animated, ViewProps } from "react-native";
import { PropsWithChildren, useEffect, useRef } from "react";

type ShakingViewProps = PropsWithChildren & ViewProps & { shaking: boolean };

export const SHAKE_ANIMATION_DURATION = 400;

const shakeSize = 15;
const animationSteps = [-shakeSize, shakeSize, -shakeSize, 0];

export default function ShakingView({
  shaking,
  style,
  children,
}: ShakingViewProps) {
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (shaking) {
      Animated.sequence(
        animationSteps.map((toValue) =>
          Animated.timing(translateX, {
            toValue: toValue,
            duration: SHAKE_ANIMATION_DURATION / animationSteps.length,
            useNativeDriver: true,
          }),
        ),
      ).start();
    }
  }, [shaking]);

  return (
    <Animated.View
      style={[
        {
          transform: [{ translateX }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}
