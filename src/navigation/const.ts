import { Colors } from "@/styles";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";

export const navigatorScreenOptions: NativeStackNavigationOptions = {
  headerStyle: { backgroundColor: Colors.background },
  headerTintColor: Colors.text,
  animation: "ios",
};
