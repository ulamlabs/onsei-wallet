import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CommonActions } from "@react-navigation/native";

/** Removes all screens from the stack except the last one. Prevents the user from the possibility of going back to current view */
export function resetNavigationStack(
  navigation: NativeStackNavigationProp<any>
) {
  navigation.dispatch((state) => {
    const routes = state.routes.slice(-1);
    return CommonActions.reset({
      ...state,
      routes,
      index: 0,
    });
  });
}
