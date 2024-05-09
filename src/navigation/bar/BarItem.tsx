import { Animated, LayoutChangeEvent, Pressable } from "react-native";
import {
  CommonActions,
  TabNavigationState,
  ParamListBase,
  Route,
} from "@react-navigation/native";
import { Colors } from "@/styles";
import { useEffect, useMemo, useRef, useState } from "react";
import { BAR_ANIMATION_DURATION, BAR_BORDER_RADIUS } from "./const";
import { BarDescriptor } from "./types";
import { NavigationProp } from "@/types";

type BarItemProps = {
  state: TabNavigationState<ParamListBase>;
  descriptor: BarDescriptor;
  route: Route<any>;
  index: number;
  navigation: NavigationProp;
  position: number;
  onWidth: (width: number) => void;
};

const ICON_WIDTH = 40;
const PADDING = 20;

export default function BarItem({
  state,
  descriptor,
  route,
  index,
  navigation,
  position,
  onWidth,
}: BarItemProps) {
  const [textWidth, setTextWidth] = useState(0);
  const [ready, setReady] = useState(false);
  const scale = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const iconTranslateX = useRef(new Animated.Value(0)).current;

  const isActive = useMemo(() => state.index === index, [state.index, index]);

  const scaleValue = useMemo(() => (isActive ? 1 : 0), [isActive]);

  const iconTranslateXValue = useMemo(
    () => (isActive ? -textWidth / 2 : 0),
    [isActive, textWidth],
  );

  useEffect(() => {
    if (!ready && position) {
      scale.setValue(scaleValue);
      iconTranslateX.setValue(iconTranslateXValue);
      setReady(true);
    }
  }, [position, scaleValue, iconTranslateXValue]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    Animated.timing(scale, {
      toValue: scaleValue,
      duration: BAR_ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();

    Animated.timing(iconTranslateX, {
      toValue: iconTranslateXValue,
      duration: BAR_ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();
  }, [scaleValue, iconTranslateXValue]);

  useEffect(() => {
    if (!position) {
      return;
    }

    if (!ready) {
      translateX.setValue(position);
      return;
    }

    Animated.timing(translateX, {
      toValue: position,
      duration: BAR_ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();
  }, [position]);

  function jumpTo(route: Route<any>) {
    if (!isActive) {
      navigation.dispatch({
        ...CommonActions.navigate(route.name, route.params),
        target: state.key,
      });
    }
  }

  function onTextLayout(event: LayoutChangeEvent) {
    setTextWidth(event.nativeEvent.layout.width);
  }

  function onLayout(event: LayoutChangeEvent) {
    onWidth(event.nativeEvent.layout.width);
  }

  return (
    <Animated.View
      key={route.key}
      style={[
        {
          position: "absolute",
          height: "100%",
          transform: [{ translateX }],
          alignItems: "center",
          opacity: ready ? 1 : 0,
        },
      ]}
    >
      <Animated.View
        onLayout={onLayout}
        style={{
          position: "absolute",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: ICON_WIDTH + PADDING,
          paddingRight: PADDING,
          borderRadius: BAR_BORDER_RADIUS,
          transform: [{ scaleX: scale }],
          opacity: scale,
          backgroundColor: Colors.background,
        }}
      >
        <Animated.Text onLayout={onTextLayout} style={{ color: Colors.text }}>
          {descriptor.options.title ?? route.name}
        </Animated.Text>
      </Animated.View>

      <Animated.View
        style={[
          {
            height: "100%",
            position: "absolute",
            transform: [{ translateX: iconTranslateX }],
          },
        ]}
      >
        <Pressable
          onPress={() => jumpTo(route)}
          style={{
            height: "100%",
            justifyContent: "center",
            paddingHorizontal: 15,
          }}
        >
          <descriptor.options.icon
            color={isActive ? Colors.text : Colors.text100}
            size={28}
          />
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}
