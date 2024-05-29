import { Text } from "@/components";
import { NavigationProp } from "@/types";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";

export default function CancelHeaderRight() {
  const navigation = useNavigation<NavigationProp>();
  return (
    <TouchableOpacity onPress={() => navigation.navigate("Home")}>
      <Text>Cancel</Text>
    </TouchableOpacity>
  );
}
