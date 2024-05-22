import {
  Descriptor,
  NavigationProp,
  ParamListBase,
  RouteProp,
  TabActionHelpers,
  TabNavigationState,
} from "@react-navigation/native";
import { Icon } from "iconsax-react-native";

export type BarNavigationScreenOptions = {
  icon: Icon;
  title?: string;
  headerShown?: boolean;
  headerTitle?: () => JSX.Element;
  headerRight?: () => JSX.Element;
};

export type BarNavigationProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = keyof ParamList,
  NavigatorID extends string | undefined = undefined,
> = NavigationProp<
  ParamList,
  RouteName,
  NavigatorID,
  TabNavigationState<ParamListBase>,
  BarNavigationScreenOptions
> &
  TabActionHelpers<ParamListBase>;

export type BarDescriptor = Descriptor<
  BarNavigationScreenOptions,
  BarNavigationProp<ParamListBase>,
  RouteProp<ParamListBase>
>;

export type BarDescriptorMap = Record<string, BarDescriptor>;
