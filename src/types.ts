import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabsParamList } from "./navigation/BottomBarsNavigation";
import { HomeParamList } from "./navigation/HomeNavigation";
import { OnboardingParamList } from "./navigation/OnboardingNavigation";
import { LockParamList } from "./navigation/LockNavigation";

export type NavigatorParamsList = BottomTabsParamList &
  OnboardingParamList &
  LockParamList &
  HomeParamList &
  BottomTabsParamList;

export type NavigationProp = NativeStackNavigationProp<
  NavigatorParamsList,
  any
>;

export type Node = "MainNet" | "TestNet";
