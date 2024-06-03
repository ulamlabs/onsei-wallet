import { Colors } from "@/styles";
import { PropsWithChildren, ReactElement } from "react";
import { View } from "react-native";
import { Text } from "../typography";

type OptionProps = PropsWithChildren & {
  label?: string | JSX.Element;
  icon?: ReactElement;
  disabled?: boolean;
};

export default function Option({
  label,
  icon,
  disabled,
  children,
}: OptionProps) {
  return (
    <View style={{ backgroundColor: Colors.background200 }}>
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
          height: 63,
          justifyContent: "space-between",
          paddingHorizontal: 22,
          ...(disabled ? { opacity: 0.3 } : {}),
        }}
      >
        {(label || icon) && (
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            {icon}
            <Text style={{ color: "white", fontSize: 16 }}>{label}</Text>
          </View>
        )}
        {children}
      </View>
    </View>
  );
}
