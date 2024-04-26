import tw from "@/lib/tailwind";
import { ActivityIndicator, Pressable, Text, ViewStyle } from "react-native";

type ButtonProps = {
  label?: string;
  onPress: () => any;
  isLoading?: boolean;
  styles?: ViewStyle;
  icon?: JSX.Element;
  type?: "primary" | "danger" | "ghost";
  disabled?: boolean;
  textStyles?: string;
};

export default ({
  label,
  isLoading,
  styles,
  textStyles,
  onPress,
  icon,
  type = "primary",
  disabled = false,
}: ButtonProps) => {
  return (
    <Pressable
      disabled={disabled}
      style={tw.style(
        "items-center px-6 py-3 rounded-1 flex flex-row",
        type === "primary" && "bg-primary-400",
        type === "danger" && "bg-danger-600",
        icon && label && "gap-3",
        styles
      )}
      onPress={onPress}
    >
      {isLoading && (
        <ActivityIndicator size={5} color="#fff" style={tw`mr-5`} />
      )}
      {icon}
      {label && (
        <Text style={tw.style("text-white font-bold", textStyles)}>
          {label}
        </Text>
      )}
    </Pressable>
  );
};
