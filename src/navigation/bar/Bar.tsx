import { LayoutChangeEvent, View } from "react-native";
import { TabNavigationState, ParamListBase } from "@react-navigation/native";
import BarItem from "./BarItem";
import { Colors } from "@/styles";
import { useMemo, useState } from "react";
import { distributeItems } from "./utils";
import { BAR_BORDER_RADIUS, BAR_HEIGHT, BAR_PADDING } from "./const";
import { BarDescriptorMap } from "./types";
import { NavigationProp } from "@/types";

type BarProps = {
  state: TabNavigationState<ParamListBase>;
  descriptors: BarDescriptorMap;
  navigation: NavigationProp;
};

export default function Bar({ state, descriptors, navigation }: BarProps) {
  const [space, setSpace] = useState(0);
  const [widths, setWidths] = useState<number[]>([]);

  const maxWidth = useMemo(() => {
    return widths.reduce((acc, width) => acc + width, 0);
  }, [widths]);

  const positions = useMemo(() => {
    if (space && widths.length === state.routes.length) {
      return distributeItems(space, widths, state.index);
    }
    return [];
  }, [state.index, descriptors, widths, space]);

  function onLayout(event: LayoutChangeEvent) {
    setSpace(event.nativeEvent.layout.width);
  }

  function onItemWidth(width: number, index: number) {
    widths[index] = width;
    setWidths([...widths]);
  }

  return (
    <View
      style={{
        backgroundColor: Colors.background,
        padding: 20,
        alignItems: "center",
      }}
    >
      <View
        style={{
          backgroundColor: Colors.background300,
          borderRadius: BAR_BORDER_RADIUS,
          padding: BAR_PADDING,
          height: BAR_HEIGHT,
          width: maxWidth,
          maxWidth: "100%",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            borderRadius: BAR_BORDER_RADIUS,
            overflow: "hidden",
            height: "100%",
          }}
          onLayout={onLayout}
        >
          {state.routes.map((route, index) => (
            <BarItem
              position={positions[index]}
              descriptor={descriptors[route.key]}
              route={route}
              index={index}
              navigation={navigation}
              state={state}
              onWidth={(width) => onItemWidth(width, index)}
              key={route.key}
            />
          ))}
        </View>
      </View>
    </View>
  );
}
