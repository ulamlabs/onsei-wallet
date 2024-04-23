import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabsParamList } from "./navigation/BottomBarsNavigation";
import { ConnectedStackParamList } from "./navigation/ConnectedScreenNavigation";
import { MainStackParamList } from "./navigation/MainScreenNavigation";
import { RootParamList } from "./navigation/RootScreenNavigation";

export type NavigatorParamsList = RootParamList &
  BottomTabsParamList &
  MainStackParamList &
  ConnectedStackParamList;

export type NavigationProp = NativeStackNavigationProp<
  NavigatorParamsList,
  any
>;
