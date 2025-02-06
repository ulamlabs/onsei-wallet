import { Row } from "@/components";
import { Colors } from "@/styles";
import {
  MaterialTopTabDescriptorMap,
  MaterialTopTabNavigationEventMap,
} from "@react-navigation/material-top-tabs/lib/typescript/src/types";
import {
  NavigationHelpers,
  ParamListBase,
  TabNavigationState,
} from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import { Animated, View } from "react-native";
import BarItem from "./BarItem";
import { BAR_BORDER_RADIUS, BAR_HEIGHT, BAR_PADDING } from "./const";

type BarProps = {
  state: TabNavigationState<ParamListBase>;
  descriptors: MaterialTopTabDescriptorMap;
  navigation: NavigationHelpers<
    ParamListBase,
    MaterialTopTabNavigationEventMap
  >;
};

export default function Bar({
  state,
  descriptors,
  navigation,
  state: { index },
}: BarProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    const itemWidth = barWidth / state.routes.length;
    Animated.timing(translateX, {
      toValue: index * itemWidth,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [index, state.routes.length, barWidth]);

  return (
    <Row
      style={{
        backgroundColor: "transparent",
        alignItems: "center",
        width: "100%",
        justifyContent: "center",
        position: "absolute",
        paddingBottom: 34,
        bottom: 0,
      }}
    >
      <LinearGradient
        style={{
          top: -20,
          position: "absolute",
          width: "100%",
          height: 126,
        }}
        colors={[Colors.transparent, Colors.background]}
        pointerEvents="none"
      />
      <View
        style={{
          backgroundColor: Colors.background200,
          borderRadius: BAR_BORDER_RADIUS,
          padding: BAR_PADDING,
          height: BAR_HEIGHT,
        }}
      >
        <View
          onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
          style={{
            flexDirection: "row",
            borderRadius: BAR_BORDER_RADIUS,
            overflow: "hidden",
            height: "100%",
            gap: 8,
          }}
        >
          {state.routes.map((route, index) => (
            <BarItem
              descriptor={descriptors[route.key]}
              route={route}
              index={index}
              navigation={navigation}
              state={state}
              key={route.key}
              totalTabs={state.routes.length}
            />
          ))}
          <Animated.View
            style={{
              position: "absolute",
              bottom: 0,
              height: "100%",
              transform: [{ translateX }],
              width: `${100 / state.routes.length}%`,
              borderRadius: 28,
              backgroundColor: Colors.background,
              zIndex: -1,
            }}
          />
        </View>
      </View>
    </Row>
  );
}
