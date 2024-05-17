import { Colors, FontWeights } from "@/styles";
import { Icon } from "iconsax-react-native";
import { Pressable, StyleProp, TextStyle, ViewStyle } from "react-native";
import { Text } from "../typography";

export type BaseButtonProps = {
  title?: string;
  onPress: () => any;
  style?: StyleProp<ViewStyle>;
  icon?: Icon;
  disabled?: boolean;
  textStyle?: StyleProp<TextStyle>;
  color?: string;
};

export default function BaseButton({
  title,
  style,
  textStyle,
  onPress,
  icon: Icon,
  disabled = false,
  color = Colors.text,
}: BaseButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      style={[
        {
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 24,
          paddingVertical: 18,
          borderRadius: 22,
          flexDirection: "row",
          gap: 8,
        },
        disabled ? { opacity: 0.3 } : {},
        style,
      ]}
      onPress={onPress}
    >
      {Icon && <Icon color={color} size={20} />}
      {title && (
        <Text style={[{ color, fontFamily: FontWeights.bold }, textStyle]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}
