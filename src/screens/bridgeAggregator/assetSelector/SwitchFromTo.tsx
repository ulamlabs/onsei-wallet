import { useSafeLayoutPaddings } from "@/components";
import { Pressable, StyleSheet, useWindowDimensions } from "react-native";
import { selectorFieldHeight } from "./components/SelectorField";
import { selectorFieldsGap } from "./const";
import { Colors } from "@/styles";
import Svg, { Path } from "react-native-svg";

const switchSize = 44;

type Props = {
  onPress: () => void;
};

export function SwitchFromTo({ onPress }: Props) {
  const { width } = useWindowDimensions();
  const { paddingLeft } = useSafeLayoutPaddings();

  return (
    <Pressable
      style={[
        styles.pressable,
        {
          left: (width - switchSize) / 2 - paddingLeft,
          top: (selectorFieldHeight * 2 + selectorFieldsGap - switchSize) / 2,
        },
      ]}
      onPress={onPress}
    >
      <SwitchArrows />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: switchSize,
    height: switchSize,
    backgroundColor: Colors.tokenBoxBackground,
    borderColor: Colors.background,
    borderWidth: 4,
    position: "absolute",
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },
});

function SwitchArrows() {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" color={"white"}>
      <Path
        d="M10.4498 6.71997L6.72974 3L3.00977 6.71997"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke={Colors.text100}
      />
      <Path
        d="M6.72949 21V3"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke={Colors.text100}
      />
      <Path
        d="M13.5498 17.28L17.2698 21L20.9898 17.28"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke={Colors.text}
      />
      <Path
        d="M17.2695 3V21"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke={Colors.text}
      />
    </Svg>
  );
}
