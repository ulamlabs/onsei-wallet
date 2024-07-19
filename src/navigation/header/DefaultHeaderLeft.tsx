import { Colors } from "@/styles";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from "iconsax-react-native";
import { Platform, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DefaultHeaderLeft() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  return Platform.OS === "ios" ? (
    <Pressable
      onPress={() => navigation.goBack()}
      style={{
        marginRight: 24,
      }}
    >
      <ArrowLeft color={Colors.text} />
    </Pressable>
  ) : (
    <></>
  );
}
