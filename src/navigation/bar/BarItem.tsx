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
import { Pressable, View } from "react-native";

type BarItemProps = {
  state: TabNavigationState<ParamListBase>;
  descriptor: MaterialTopTabDescriptor;
  route: Route<any>;
  index: number;
  navigation: NavigationHelpers<
    ParamListBase,
    MaterialTopTabNavigationEventMap
  >;
};

export default function BarItem({
  state,
  descriptor,
  route,
  index,
  navigation,
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

  return (
    <Pressable onPress={onPress} key={route.key}>
      <View
        style={{
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          width: 107,
          borderRadius: 28,
          backgroundColor: isFocused ? Colors.background : Colors.background200,
          paddingHorizontal: 16,
          paddingVertical: 10,
          gap: 2,
        }}
      >
        {descriptor.options.tabBarIcon!({
          focused: isFocused,
          color: Colors.text,
        })}
        <Text
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
