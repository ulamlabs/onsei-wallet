import { Colors } from "@/styles";
import { Pressable, StyleProp, Text, TextStyle, ViewStyle } from "react-native";

export type BaseButtonProps = {
  title?: string;
  onPress: () => any;
  style?: StyleProp<ViewStyle>;
  icon?: JSX.Element;
  disabled?: boolean;
  textStyle?: StyleProp<TextStyle>;
};

export default function BaseButton({
  title,
  style,
  textStyle,
  onPress,
  icon,
  disabled = false,
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
        },
        icon ? { gap: 8 } : {},
        disabled ? { opacity: 0.3 } : {},
        style,
      ]}
      onPress={onPress}
    >
      {icon}
      {title && (
        <Text style={[{ color: Colors.text, fontWeight: "bold" }, textStyle]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}
