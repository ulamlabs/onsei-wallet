import tw from "@/lib/tailwind";
import { ActivityIndicator, Pressable, Text, ViewStyle } from "react-native";

type PrimaryButtonProps = {
  label?: string;
  onPress: () => any;
  isLoading?: boolean;
  styles?: ViewStyle;
  icon?: JSX.Element;
  status?: "primary" | "danger" | "ghost";
  disabled?: boolean;
};

export default ({
  label,
  isLoading,
  styles,
  onPress,
  icon,
  status = "primary",
  disabled = false,
}: PrimaryButtonProps) => {
  return (
    <Pressable
      disabled={disabled}
      style={[
        tw`items-center px-6 py-3 rounded-1 flex flex-row ${
          status === "primary" ? "bg-primary-400" : ""
        } ${status === "danger" ? "bg-danger-600" : ""}`,
        styles,
      ]}
      onPress={onPress}
    >
      {isLoading && (
        <ActivityIndicator size={5} color="#fff" style={tw`mr-5`} />
      )}
      {icon}
      {label && <Text style={tw`text-white font-bold`}>{label}</Text>}
    </Pressable>
  );
};
