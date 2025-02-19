import { Text } from "@/components";
import { Colors, FontSizes, FontWeights } from "@/styles";
import {
  MaterialTopTabDescriptor,
  MaterialTopTabNavigationEventMap,
} from "@react-navigation/material-top-tabs/lib/typescript/src/types";
import {
  NavigationHelpers,
  ParamListBase,
  Route,
  TabNavigationState,
} from "@react-navigation/native";
import { DimensionValue, Pressable, View } from "react-native";

type BarItemProps = {
  state: TabNavigationState<ParamListBase>;
  descriptor: MaterialTopTabDescriptor;
  route: Route<any>;
  index: number;
  navigation: NavigationHelpers<
    ParamListBase,
    MaterialTopTabNavigationEventMap
  >;
  totalTabs: number;
};

export default function BarItem({
  state,
  descriptor,
  route,
  index,
  navigation,
  totalTabs,
}: BarItemProps) {
  const isFocused = state.index === index;

  const onPress = () => {
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  };

  const width: DimensionValue = `${100 / totalTabs}%`;

  return (
    <Pressable onPress={onPress} key={route.key}>
      <View
        style={{
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          width,
          minWidth: 80,
          borderRadius: 28,
          paddingHorizontal: 8,
          paddingVertical: 10,
          gap: 2,
        }}
      >
        {descriptor.options.tabBarIcon!({
          focused: isFocused,
          color: Colors.text,
        })}
        <Text
          adjustsFontSizeToFit
          numberOfLines={1}
          style={{
            color: isFocused ? Colors.text : Colors.text100,
            fontSize: FontSizes.xs,
            fontFamily: FontWeights.medium,
          }}
        >
          {descriptor.options.title ?? route.name}
        </Text>
      </View>
    </Pressable>
  );
}
