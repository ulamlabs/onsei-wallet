import { Colors, FontSizes, FontWeights } from "@/styles";
import { scale, verticalScale } from "@/utils";
import { LinearGradient } from "expo-linear-gradient";
import { Icon, IconProps } from "iconsax-react-native";
import { Pressable, StyleProp, TextStyle, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
  testID?: string;
  elevate?: boolean;
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
  testID,
  elevate = false,
}: BaseButtonProps) {
  const insets = useSafeAreaInsets();

  const content = () => (
    <Pressable
      testID={testID}
      disabled={disabled || loading}
      style={[
        {
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 24,
          paddingVertical: loading ? 18 : 20,
          borderRadius: 22,
          flexDirection: iconAllign === "left" ? "row" : "row-reverse",
          gap: 8,
        },
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
            <Text
              style={[
                {
                  color: disabled ? Colors.disabledButtonText : color,
                  fontFamily: FontWeights.bold,
                  fontSize: FontSizes.base,
                },
                textStyle,
              ]}
            >
              {title}
            </Text>
          )}
        </>
      )}
    </Pressable>
  );

  return elevate ? (
    <View
      style={{
        position: "absolute",
        bottom: Math.max(verticalScale(50), insets.bottom),
        width: "100%",
        left: Math.max(scale(16), insets.left),
      }}
    >
      <LinearGradient
        style={{
          bottom: 0,
          position: "absolute",
          width: "100%",
          height: 90,
        }}
        colors={[Colors.transparent, Colors.background]}
        end={{ x: 0.5, y: 0.5 }}
        pointerEvents="none"
      />
      {content()}
    </View>
  ) : (
    content()
  );
}
