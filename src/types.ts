import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabsParamList } from "./navigation/BottomBarsNavigation";
import { ConnectedStackParamList } from "./navigation/ConnectedScreenNavigation";
import { MainStackParamList } from "./navigation/MainScreenNavigation";

export type NavigatorParamsList = BottomTabsParamList &
  MainStackParamList &
  ConnectedStackParamList;

export type NavigationProp = NativeStackNavigationProp<
  NavigatorParamsList,
  any
>;
