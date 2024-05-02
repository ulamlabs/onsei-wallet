import { Colors } from "@/styles";
import { ActivityIndicator } from "react-native";

export default function Loader() {
  return <ActivityIndicator size={40} color={Colors.text} />;
}
