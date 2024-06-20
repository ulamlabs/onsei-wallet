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
import { useEffect, useRef } from "react";
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

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: index * 123,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [index]);

  return (
    <Row
      style={{
        backgroundColor: Colors.background,
        padding: 20,
        alignItems: "center",
        width: "100%",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          backgroundColor: Colors.background200,
          borderRadius: BAR_BORDER_RADIUS,
          padding: BAR_PADDING,
          height: BAR_HEIGHT,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            borderRadius: BAR_BORDER_RADIUS,
            overflow: "hidden",
            height: "100%",
            gap: 16,
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
            />
          ))}
          <Animated.View
            style={{
              position: "absolute",
              bottom: 0,
              height: "100%",
              transform: [{ translateX }],
              width: 107,
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
