import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import WalletOverview from "@/screens/WalletOverview";
import AddressBook from "@/screens/AddressBook";
import { User, Book1, Setting2 } from "iconsax-react-native";
import tw from "@/lib/tailwind";
import { View } from "react-native";
import SettingsScreen from "@/screens/settings/SettingsScreen";

export type BottomTabsParamList = {
  "My wallet": undefined;
  "Address Book": undefined;
  Settings: undefined;
};

const { Navigator, Screen } = createBottomTabNavigator<BottomTabsParamList>();

export default () => {
  const primaryColor = tw.color("primary-400");
  const inactiveColor = tw.color("grey");

  return (
    <Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let icon;
          const iconColor = focused ? primaryColor : inactiveColor;
          if (route.name === "My wallet") icon = <User color={iconColor} />;
          else if (route.name === "Address Book")
            icon = <Book1 color={iconColor} />;
          else if (route.name === "Settings")
            icon = <Setting2 color={iconColor} />;

          return (
            <View
              style={tw.style(
                "border-t-2 w-[100%] items-center -mt-1 pt-2",
                focused ? "border-primary-400" : "border-grey"
              )}
            >
              {icon}
            </View>
          );
        },
        tabBarActiveTintColor: primaryColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarLabel: route.name.toUpperCase(),
        tabBarLabelStyle: tw`font-bold`,
        tabBarStyle: tw`bg-background`,
        headerStyle: { backgroundColor: tw.color("header-background") },
        headerTintColor: "white",
      })}
    >
      <Screen name="My wallet" component={WalletOverview} />
      <Screen name="Address Book" component={AddressBook} />
      <Screen name="Settings" component={SettingsScreen} />
    </Navigator>
  );
};
