import { View } from "react-native";
import {
  useNavigationBuilder,
  TabRouter,
  DefaultNavigatorOptions,
  ParamListBase,
  TabNavigationState,
  TabRouterOptions,
  TabActionHelpers,
} from "@react-navigation/native";
import BarView from "./BarView";
import Bar from "./Bar";
import { Colors } from "@/styles";
import { BarNavigationScreenOptions } from "./types";

export type BarNavigationProps = DefaultNavigatorOptions<
  ParamListBase,
  TabNavigationState<ParamListBase>,
  BarNavigationScreenOptions,
  any
> &
  TabRouterOptions;

export default function BarNavigation({
  initialRouteName,
  children,
  screenOptions,
}: BarNavigationProps) {
  const { state, navigation, descriptors, NavigationContent } =
    useNavigationBuilder<
      TabNavigationState<ParamListBase>,
      TabRouterOptions,
      TabActionHelpers<ParamListBase>,
      BarNavigationScreenOptions,
      any
    >(TabRouter, {
      children,
      screenOptions,
      initialRouteName,
    });

  return (
    <NavigationContent>
      <View style={{ flex: 1, backgroundColor: Colors.background }}>
        {state.routes.map((route, index) => (
          <BarView
            index={index}
            descriptor={descriptors[route.key]}
            state={state}
            key={route.key}
          />
        ))}
      </View>
      <Bar
        state={state}
        descriptors={descriptors}
        navigation={navigation as any}
      />
    </NavigationContent>
  );
}
