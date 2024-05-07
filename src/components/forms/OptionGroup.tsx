import { PropsWithChildren } from "react";
import { View } from "react-native";

export default function OptionGroup({ children }: PropsWithChildren) {
  return (
    <View
      style={{
        borderRadius: 22,
        gap: 1,
        overflow: "hidden",
      }}
    >
      {children}
    </View>
  );
}
