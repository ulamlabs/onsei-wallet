import { Colors } from "@/styles";
import { Add, IconProps } from "iconsax-react-native";
import { StyleSheet } from "react-native";

export default function XIcon(props: IconProps) {
  return <Add style={styles.icon} {...props} />;
}

const styles = StyleSheet.create({
  icon: {
    transform: [{ rotate: "45deg" }],
    color: Colors.text100,
  },
});
