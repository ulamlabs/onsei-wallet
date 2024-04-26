import tw from "@/lib/tailwind";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";

export const navigatorScreenOptions: NativeStackNavigationOptions = {
  headerStyle: { backgroundColor: tw.color("header-background") },
  headerTintColor: "white",
};
