import { Colors } from "@/styles";
import { Switch, SwitchProps } from "react-native";

export default function CustomSwitch({
  disabled,
  onValueChange,
  ...props
}: SwitchProps) {
  function onValueChangeWrapped(value: boolean) {
    if (!disabled && onValueChange) {
      onValueChange(value);
    }
  }

  return (
    <Switch
      onValueChange={onValueChangeWrapped}
      trackColor={{
        true: Colors.labelBackground,
        false: Colors.activeInputBorderColor,
      }}
      ios_backgroundColor={Colors.activeInputBorderColor}
      thumbColor={Colors.text}
      disabled={disabled}
      {...props}
    />
  );
}
