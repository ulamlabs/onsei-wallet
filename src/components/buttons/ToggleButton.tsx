import { Colors } from "@/styles";
import React, { SetStateAction, useState } from "react";
import { Animated, Pressable } from "react-native";
import AnimatedToggleText from "../AnimatedToggleText";

type Option<T> = {
  label: string;
  value: T;
};

type Props<T extends string> = {
  onPress: (value: SetStateAction<T>) => void;
  selectedValue: T;
  options: [Option<T>, Option<T>];
};

function ToggleButton<T extends string>({
  onPress,
  selectedValue,
  options,
}: Props<T>) {
  const [translate] = useState(new Animated.Value(0));

  const selectedIndex = options.findIndex(
    (option) => option.value === selectedValue,
  );

  const toggleValue = () => {
    const nextIndex = (selectedIndex + 1) % 2;
    const nextValue = options[nextIndex].value;

    Animated.timing(translate, {
      toValue: nextIndex * 134,
      duration: 200,
      useNativeDriver: false,
    }).start(() => onPress(nextValue));
  };

  const textColor1 = translate.interpolate({
    inputRange: [0, 134],
    outputRange: [Colors.text, Colors.text100],
  });
  const textColor2 = translate.interpolate({
    inputRange: [0, 134],
    outputRange: [Colors.text100, Colors.text],
  });

  return (
    <Pressable
      onPress={toggleValue}
      style={{
        flexDirection: "row",
        marginTop: 16,
        position: "relative",
        borderRadius: 26,
        backgroundColor: Colors.tokenBoxBackground,
        padding: 4,
      }}
    >
      <AnimatedToggleText color={textColor1} label={options[0].label} />
      <AnimatedToggleText color={textColor2} label={options[1].label} />
      <Animated.View
        style={{
          width: 134,
          position: "absolute",
          backgroundColor: Colors.markerBackground,
          zIndex: -1,
          borderRadius: 26,
          top: 4,
          left: 4,
          bottom: 4,
          transform: [{ translateX: translate }],
        }}
      />
    </Pressable>
  );
}

export default ToggleButton;
