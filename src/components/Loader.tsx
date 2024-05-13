import { Colors } from "@/styles";
import { ActivityIndicator } from "react-native";

type LoaderSizes = "small" | "medium" | "large";

type LoaderProps = {
  size?: LoaderSizes;
  color?: string;
};

const SIZE_TO_PX: Record<LoaderSizes, number> = {
  small: 16,
  medium: 24,
  large: 40,
};

export default function Loader({
  size = "large",
  color = Colors.text,
}: LoaderProps) {
  return <ActivityIndicator size={SIZE_TO_PX[size]} color={color} />;
}
