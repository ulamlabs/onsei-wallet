import { Colors, FontWeights } from "@/styles";
import { Icon, IconProps } from "iconsax-react-native";
import { Pressable, StyleProp, TextStyle, ViewStyle } from "react-native";
import Loader from "../Loader";
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
  loading?: boolean;
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
  loading = false,
}: BaseButtonProps) {
  return (
    <Pressable
      disabled={disabled || loading}
      style={[
        {
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 24,
          paddingVertical: loading ? 16 : 18,
          borderRadius: 22,
          flexDirection: iconAllign === "left" ? "row" : "row-reverse",
          gap: 8,
        },
        disabled ? { opacity: 0.3 } : {},
        style,
      ]}
      onPress={onPress}
    >
      {loading ? (
        <Loader size="medium" color={Colors.background} />
      ) : (
        <>
          {Icon && (
            <Icon color={iconColor} size={iconSize} variant={iconVariant} />
          )}
          {title && (
            <Text style={[{ color, fontFamily: FontWeights.bold }, textStyle]}>
              {title}
            </Text>
          )}
        </>
      )}
    </Pressable>
  );
}
