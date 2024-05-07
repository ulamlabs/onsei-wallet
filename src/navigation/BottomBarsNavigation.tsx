import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import WalletOverview from "@/screens/WalletOverview";
import AddressBook from "@/screens/addressBook/AddressBookScreen";
import { User, Book1, Setting2 } from "iconsax-react-native";
import { View } from "react-native";
import SettingsScreen from "@/screens/settings/SettingsScreen";
import { Colors } from "@/styles";

export type BottomTabsParamList = {
  "My wallet": undefined;
  "Address Book": undefined;
  Settings: undefined;
};

const { Navigator, Screen } = createBottomTabNavigator<BottomTabsParamList>();

export default function BottomBarsNavigation() {
  return (
    <Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let icon;
          const iconColor = focused ? Colors.text : Colors.text100;
          if (route.name === "My wallet") icon = <User color={iconColor} />;
          else if (route.name === "Address Book")
            icon = <Book1 color={iconColor} />;
          else if (route.name === "Settings")
            icon = <Setting2 color={iconColor} />;

          return (
            <View
              style={[
                {
                  borderTopWidth: 2,
                  borderColor: focused ? Colors.text : Colors.text100,
                  flex: 1,
                  width: "100%",
                  alignItems: "center",
                  paddingVertical: 5,
                },
              ]}
            >
              {icon}
            </View>
          );
        },
        tabBarActiveTintColor: Colors.text,
        tabBarInactiveTintColor: Colors.text100,
        tabBarLabel: route.name.toUpperCase(),
        tabBarLabelStyle: { fontWeight: "bold" },
        tabBarStyle: { backgroundColor: Colors.background },
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.text,
      })}
    >
      <Screen name="My wallet" component={WalletOverview} />
      <Screen name="Address Book" component={AddressBook} />
      <Screen name="Settings" component={SettingsScreen} />
    </Navigator>
  );
}
