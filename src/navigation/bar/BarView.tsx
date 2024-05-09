import { Animated, Dimensions } from "react-native";
import { TabNavigationState, ParamListBase } from "@react-navigation/native";
import { useEffect, useMemo, useRef, useState } from "react";
import { BAR_ANIMATION_DURATION } from "./const";
import { Colors } from "@/styles";
import { Header } from "@react-navigation/elements";
import { BarDescriptor } from "./types";

type BarNavigationProps = {
  state: TabNavigationState<ParamListBase>;
  descriptor: BarDescriptor;
  index: number;
};

export default function BarView({
  state,
  descriptor,
  index,
}: BarNavigationProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;

  const isActive = useMemo(() => {
    return state.index === index;
  }, [state.index]);

  const [isDisplayed, setIsDisplayed] = useState(isActive);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationTimeout, setAnimationTimeout] = useState<number>(0);
  const [displayTimeout, setDisplayTimeout] = useState<number>(0);

  useEffect(() => {
    if (animationTimeout) {
      clearTimeout(animationTimeout);
    }
    if (displayTimeout) {
      clearTimeout(displayTimeout);
    }

    Animated.timing(opacity, {
      toValue: isActive ? 1 : 0,
      duration: BAR_ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();

    const offset = Dimensions.get("window").width;

    Animated.timing(translateX, {
      toValue: isActive ? 0 : state.index > index ? -offset : offset,
      duration: BAR_ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();

    if (isActive) {
      setIsDisplayed(true);
    } else {
      setDisplayTimeout(
        setTimeout(() => {
          setIsDisplayed(false);
        }, BAR_ANIMATION_DURATION) as any,
      );
    }

    setIsAnimating(true);
    setAnimationTimeout(
      setTimeout(() => {
        setIsAnimating(false);
      }, BAR_ANIMATION_DURATION) as any,
    );
  }, [isActive]);

  return (
    <Animated.View
      style={{
        position: isAnimating ? "absolute" : "relative",
        display: isDisplayed ? "flex" : "none",
        width: "100%",
        opacity: opacity,
        transform: [{ translateX: translateX }],
      }}
    >
      {descriptor.options.headerShown !== false && (
        <Header
          title={descriptor.options.title ?? descriptor.route.name}
          headerStyle={{
            backgroundColor: Colors.background,
          }}
          headerTintColor={Colors.text}
          headerShadowVisible={false}
        />
      )}
      {descriptor.render()}
    </Animated.View>
  );
}
