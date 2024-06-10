import { Colors } from "@/styles";
import { NavigationProp } from "@/types";
import { useNavigation } from "@react-navigation/native";
import { Setting4 } from "iconsax-react-native";
import { TouchableOpacity } from "react-native";

export default function SettingsHeaderRight(
  gas: number,
  disabled: boolean | undefined,
) {
  const navigation = useNavigation<NavigationProp>();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Transaction settings", { gas })}
      disabled={disabled}
    >
      <Setting4 color={disabled ? Colors.text300 : Colors.text} size={22} />
    </TouchableOpacity>
  );
}
