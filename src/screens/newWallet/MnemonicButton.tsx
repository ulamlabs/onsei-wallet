import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable } from "react-native";
import { Text } from "@/components";
import { Colors } from "@/styles";
import { getNumberName } from "@/utils";

const ANIMATION_DURATION = 300;

type MnemonicButtonProps = {
  title: string;
  onPress: (title: string) => void;
  selectedAs?: number;
};

export default function MnemonicButton({
  title,
  onPress,
  selectedAs,
}: MnemonicButtonProps) {
  const [selectionLabel, setLabel] = useState("0");
  const animatedColor = useRef(new Animated.Value(0)).current;
  const bgColor = animatedColor.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.background100, Colors.text],
  });
  const borderColor = animatedColor.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.inputBorderColor, Colors.activeInputBorderColor],
  });

  useEffect(() => {
    if (selectedAs) {
      setLabel(getNumberName(selectedAs).counter);
    }

    Animated.timing(animatedColor, {
      toValue: selectedAs ? 1 : 0,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();
  }, [selectedAs]);

  return (
    <Animated.View
      style={{
        position: "relative",
        width: "47.5%",
        marginRight: "5%",
        marginTop: 16,
        borderRadius: 18,
        backgroundColor: bgColor,
        borderWidth: 1,
        borderColor: borderColor,
      }}
    >
      <Animated.View
        style={{
          position: "absolute",
          right: 10,
          top: -15,
          opacity: animatedColor,
          backgroundColor: Colors.labelBackground,
          borderWidth: 1,
          borderColor: Colors.activeInputBorderColor,
          borderRadius: 10,
          paddingHorizontal: 10,
          paddingVertical: 6,
        }}
      >
        {selectionLabel ? (
          <Text style={{ fontSize: 12 }}>{selectionLabel}</Text>
        ) : (
          <></>
        )}
      </Animated.View>

      <Pressable
        style={{ paddingHorizontal: 18, paddingVertical: 12 }}
        onPress={() => onPress(title)}
      >
        <Text style={{ color: selectedAs ? Colors.background : Colors.text }}>
          {title}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
