import { Colors, FontSizes, FontWeights } from "@/styles";
import React, { useEffect, useRef, useState } from "react";
import { Animated, PanResponder, View } from "react-native";
import { Row } from "../layout";
import { Text } from "../typography";

const SwipeButton = () => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [width, setWidth] = useState(0);
  const swipeableDimensions = 76;
  const [swipeThreshold, setSwipeThreshold] = useState(0);

  useEffect(() => {
    setSwipeThreshold(0.7 * (width - swipeableDimensions));
  }, [width]);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      translateX.setOffset(0);
      translateX.setValue(0);
    },
    onPanResponderMove: Animated.event([null, { dx: translateX }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: (evt, gestureState) => {
      const { dx } = gestureState;
      translateX.flattenOffset();
      if (dx > swipeThreshold) {
        Animated.spring(translateX, {
          toValue: width - swipeableDimensions,
          useNativeDriver: false,
        }).start(() => {
          // Handle the send action here
          console.log("Send action triggered!");
        });
      } else {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      }
    },
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
            width: swipeableDimensions,
            height: swipeableDimensions,
            borderRadius: swipeableDimensions / 2,
            backgroundColor: "#fff",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            left: 0, // Ensure it starts from the left
          },
          animatedStyle,
        ]}
        {...panResponder.panHandlers}
      >
        <Text style={{ fontSize: 24, color: "#333" }}>›</Text>
      </Animated.View>
    </View>
  );
};

export default SwipeButton;
