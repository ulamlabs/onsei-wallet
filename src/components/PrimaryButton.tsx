import { ActivityIndicator, Text, Pressable, ViewStyle } from "react-native";
import tw from "@/lib/tailwind";

type PrimaryButtonProps = {
  label: string;
  onPress: () => any;
  isLoading?: boolean;
  styles?: ViewStyle;
};

export default ({ label, isLoading, styles, onPress }: PrimaryButtonProps) => {
  return (
    <Pressable
      style={[
        tw`bg-primary-400 items-center px-6 py-3 rounded-1 flex flex-row`,
        styles,
      ]}
      onPress={onPress}
    >
      {isLoading && (
        <ActivityIndicator size={5} color="#fff" style={tw`mr-5`} />
      )}
      <Text style={tw`text-white font-bold`}>{label}</Text>
    </Pressable>
  );
};
