import { IconButton } from "@/components";
import { Colors } from "@/styles";
import { NavigationProp } from "@/types";
import { useNavigation } from "@react-navigation/native";
import { Setting4 } from "iconsax-react-native";

export default function SettingsHeaderRight(gas: number) {
  const navigation = useNavigation<NavigationProp>();
  return (
    <IconButton
      style={{ backgroundColor: Colors.background }}
      onPress={() => navigation.navigate("Transaction settings", { gas })}
      icon={Setting4}
    />
  );
}
