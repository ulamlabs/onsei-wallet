import { ReactElement } from "react";
import { Switch, SwitchProps, Text, View } from "react-native";

export type SwithWithLabelProps = SwitchProps & {
  label: string;
  icon?: ReactElement;
};

export default function SwitchWithLabel({
  label,
  icon,
  disabled,
  onValueChange,
  ...props
}: SwithWithLabelProps) {
  function onValueChangeWrapped(value: boolean) {
    if (!disabled && onValueChange) {
      onValueChange(value);
    }
  }

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        justifyContent: "space-between",
        ...(disabled ? { opacity: 0.3 } : {}),
      }}
    >
      <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
        {icon}
        <Text style={{ color: "white", fontSize: 16 }}>{label}</Text>
      </View>
      <Switch onValueChange={onValueChangeWrapped} {...props} />
    </View>
  );
}
