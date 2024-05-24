import { Colors, FontSizes, FontWeights } from "@/styles";
import { ArrowRight2 } from "iconsax-react-native";
import React, { useEffect, useState } from "react";
import {
  Animated,
  GestureResponderEvent,
  PanResponder,
  PanResponderGestureState,
  View,
} from "react-native";
import { Row } from "../layout";
import { Text } from "../typography";

type Props = {
  disabled?: boolean;
};

const SwipeButton = ({ disabled }: Props) => {
  const [translateX] = useState<Animated.Value & { _value?: number }>(
    new Animated.Value(0),
  );
  const [width, setWidth] = useState(0);
  const swipeableDimensions = 76;
  const [swipeThreshold, setSwipeThreshold] = useState(0);
  const [endReached, setEndReached] = useState(false);
  const scrollDistance = width - 76;

  useEffect(() => {
    setSwipeThreshold(0.7 * scrollDistance);
  }, [width]);

  const onComplete = () => {
    console.log("dupa");
  };

  const animateToStart = () => {
    Animated.spring(translateX, {
      toValue: 0,
      tension: 10,
      friction: 5,
      useNativeDriver: false,
    }).start();

    return setEndReached(false);
  };

  const animateToEnd = () => {
    onComplete();
    Animated.spring(translateX, {
      toValue: scrollDistance,
      tension: 10,
      friction: 5,
      useNativeDriver: false,
    }).start();

    return setEndReached(true);
  };

  const onMove = (
    _: GestureResponderEvent,
    gestureState: PanResponderGestureState,
  ) => {
    if (disabled) {
      return false;
    }

    if (gestureState.dx < 0 || gestureState.dx > scrollDistance) {
      return Animated.event([{ dx: translateX }], { useNativeDriver: false })({
        ...gestureState,
        dx: gestureState.dx < 0 ? 0 : scrollDistance,
      });
    }

    return Animated.event([{ dx: translateX }], { useNativeDriver: false })(
      gestureState,
    );
  };

  const onRelease = () => {
    if (disabled) {
      return;
    }

    if (endReached) {
      return animateToStart();
    }

    const isCompleted = translateX._value! >= swipeThreshold;

    return isCompleted ? animateToEnd() : animateToStart();
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      translateX.setOffset(0);
      translateX.setValue(0);
    },
    onPanResponderMove: onMove,
    onPanResponderRelease: onRelease,
  });

  const animatedStyle = {
    transform: [{ translateX }],
  };

  return (
    <View
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={{
        height: swipeableDimensions,
        backgroundColor: Colors.background200,
        borderRadius: 28,
        overflow: "hidden",
        justifyContent: "space-between",
        padding: 8,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Row
        style={{
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <View style={{ width: 48 }}></View>
        <Text
          style={{ fontFamily: FontWeights.bold, fontSize: FontSizes.base }}
        >
          Swipe to send
        </Text>
        <Row style={{ width: 48, gap: 0, paddingRight: 16 }}>
          <Text style={{ color: "#666", fontSize: 16, marginHorizontal: 1 }}>
            ›
          </Text>
          <Text style={{ color: "#666", fontSize: 16, marginHorizontal: 1 }}>
            ›
          </Text>
          <Text style={{ color: "#666", fontSize: 16, marginHorizontal: 1 }}>
            ›
          </Text>
        </Row>
      </Row>
      <Animated.View
        style={[
          {
            width: 64,
            height: 64,
            borderRadius: 22,
            backgroundColor: "#fff",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            left: 8,
            top: 8,
          },
          animatedStyle,
        ]}
        {...panResponder.panHandlers}
      >
        <ArrowRight2 color={Colors.background200} size={30} />
      </Animated.View>
    </View>
  );
};

export default SwipeButton;
