import { Colors } from "@/styles";
import { NavigationProp } from "@/types";
import { useNavigation } from "@react-navigation/native";
import { Setting4 } from "iconsax-react-native";
import { TouchableOpacity } from "react-native";

export default function SettingsHeaderRight(tokenId: string, gas: number) {
  const navigation = useNavigation<NavigationProp>();
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Transaction settings", { tokenId, gas })
      }
    >
      <Setting4 color={Colors.text} size={22} />
    </TouchableOpacity>
  );
}
