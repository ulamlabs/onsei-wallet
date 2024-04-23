import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import MainScreenNavigation from "./MainScreenNavigation";
import { AuthorizeScreen } from "@/screens/auth";
import { NavigatorParamsList } from "@/types";

const RootStack = createNativeStackNavigator();

export type RootParamList = {
  Main: undefined;
  Authorize: { nextRoute: keyof NavigatorParamsList; nextParams?: any };
};

export default () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Main" component={MainScreenNavigation} />
        <RootStack.Screen name="Authorize" component={AuthorizeScreen as any} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
