import { IconButton } from "@/components";
import { NavigationProp } from "@/types";
import { useNavigation } from "@react-navigation/native";
import { Add } from "iconsax-react-native";

export const AddressBookHeaderRight = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <IconButton
      style={{ backgroundColor: "transparent" }}
      icon={Add}
      testID="add-address"
      onPress={() => navigation.navigate("Saved Address")}
    />
  );
};
