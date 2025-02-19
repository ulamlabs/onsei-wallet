import { PropsWithChildren } from "react";
import { View, StyleProp, ViewStyle } from "react-native";

type OptionGroupProps = PropsWithChildren & {
  style?: StyleProp<ViewStyle>;
};

export default function OptionGroup({ children, style }: OptionGroupProps) {
  return (
    <View
      style={[
        {
          borderRadius: 22,
          gap: 1,
          overflow: "hidden",
          width: "100%",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
