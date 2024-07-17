import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from "iconsax-react-native";
import { Pressable } from "react-native";

export default function DefaultHeaderLeft() {
  const navigation = useNavigation();
  return (
    <Pressable onPress={() => navigation.goBack()} style={{ marginRight: 24 }}>
      <ArrowLeft />
    </Pressable>
  );
}
