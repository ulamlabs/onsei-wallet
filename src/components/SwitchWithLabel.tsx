import { ReactElement } from "react";
import { Switch, SwitchProps, Text, View } from "react-native";

export type SwithWithLabelProps = SwitchProps & {
  label: string;
  icon?: ReactElement;
};

export default function SwitchWithLabel({
  label,
  icon,
  ...props
}: SwithWithLabelProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
        {icon}
        <Text style={{ color: "white", fontSize: 16 }}>{label}</Text>
      </View>
      <Switch {...props} />
    </View>
  );
}
