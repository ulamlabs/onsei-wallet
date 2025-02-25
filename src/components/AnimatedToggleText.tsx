import { FontWeights } from "@/styles";
import { Animated } from "react-native";

type Props = {
  color: Animated.AnimatedInterpolation<string | number>;
  label: string;
};

function AnimatedToggleText({ color, label }: Props) {
  return (
    <Animated.Text
      style={{
        textAlign: "center",
        verticalAlign: "middle",
        color: color,
        paddingVertical: 18,
        paddingHorizontal: 24,
        width: 134,
        fontFamily: FontWeights.bold,
        fontSize: 14,
      }}
    >
      {label}
    </Animated.Text>
  );
}

export default AnimatedToggleText;
