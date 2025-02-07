import { CloseIcon } from "@/components";
import { NavigationProp } from "@/types";
import { useNavigation } from "@react-navigation/native";
import { Pressable } from "react-native";

export const SettingsHeaderLeft = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <Pressable
      style={{ marginRight: 24 }}
      onPress={() => navigation.navigate("Home")}
    >
      <CloseIcon size={14} />
    </Pressable>
  );
};
