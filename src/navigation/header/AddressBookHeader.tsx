import { IconButton, Text } from "@/components";
import { Colors, FontSizes, FontWeights } from "@/styles";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import { HomeParamList } from "../HomeNavigation";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { Add } from "iconsax-react-native";
import { NavigationProp } from "@/types";

export default function AddressBookHeaderOptions(
  route: RouteProp<HomeParamList, "Address Book">,
  title: string,
): NativeStackNavigationOptions {
  const navigation = useNavigation<NavigationProp>();
  const addressCount = route.params.addressCount || 0;
  const allAddressCount = route.params.allAddressCount || 0;

  return {
    headerTitle: () => (
      <View
        style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 5 }}
      >
        <Text
          style={[{ fontSize: FontSizes.lg, fontFamily: FontWeights.bold }]}
        >
          {title}
        </Text>
        <Text
          style={{ fontSize: FontSizes.sm, color: Colors.text100 }}
        >{`(${addressCount === allAddressCount ? `${allAddressCount}` : `${addressCount}/${allAddressCount}`})`}</Text>
      </View>
    ),
    headerRight: () => (
      <IconButton
        style={{ backgroundColor: "transparent" }}
        icon={Add}
        testID="add-address"
        onPress={() => navigation.navigate("Saved Address")}
      />
    ),
  };
}
