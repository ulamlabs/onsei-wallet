import {
  ParamListBase,
  TabNavigationState,
  createNavigatorFactory,
} from "@react-navigation/native";
import BarNavigation from "./BarNavigation";
import { BarNavigationScreenOptions } from "./types";
import { BottomTabNavigationEventMap } from "@react-navigation/bottom-tabs";

export const createBarNavigation = createNavigatorFactory<
  TabNavigationState<ParamListBase>,
  BarNavigationScreenOptions,
  BottomTabNavigationEventMap,
  typeof BarNavigation
>(BarNavigation);
