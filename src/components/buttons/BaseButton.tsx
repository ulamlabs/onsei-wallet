import { Colors, FontWeights } from "@/styles";
import { Icon, IconProps } from "iconsax-react-native";
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
  iconColor?: string;
  iconVariant?: IconProps["variant"];
  iconSize?: number;
  iconAllign?: "left" | "right";
};

export default function BaseButton({
  title,
  style,
  textStyle,
  onPress,
  icon: Icon,
  disabled = false,
  color = Colors.text,
  iconColor = color,
  iconVariant = "Linear",
  iconSize = 20,
  iconAllign = "left",
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
          flexDirection: iconAllign === "left" ? "row" : "row-reverse",
          gap: 8,
        },
        disabled ? { opacity: 0.3 } : {},
        style,
      ]}
      onPress={onPress}
    >
      {Icon && <Icon color={iconColor} size={iconSize} variant={iconVariant} />}
      {title && (
        <Text style={[{ color, fontFamily: FontWeights.bold }, textStyle]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}
