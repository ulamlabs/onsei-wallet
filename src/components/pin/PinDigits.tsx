import { Animated } from "react-native";
import { PIN_LENGTH, SHAKE_ANIMATION_DURATION } from "./const";
import PinDigit from "./PinDigit";
import { useEffect, useRef } from "react";

const digits = Array(PIN_LENGTH).fill(0);

export type PinDigitsProps = {
  pin: string;
  error: boolean;
};

const shakeSize = 20;
const animationSteps = [-shakeSize, shakeSize, -shakeSize, 0];

export default ({ pin, error }: PinDigitsProps) => {
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (error) {
      Animated.sequence(
        animationSteps.map((toValue) =>
          Animated.timing(translateX, {
            toValue: toValue,
            duration: SHAKE_ANIMATION_DURATION / animationSteps.length,
            useNativeDriver: true,
          })
        )
      ).start();
    }
  }, [error]);

  return (
    <Animated.View
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 20,
        transform: [{ translateX }],
      }}
    >
      {digits.map((_, index) => (
        <PinDigit filled={index >= pin.length} key={index} error={error} />
      ))}
    </Animated.View>
  );
};
