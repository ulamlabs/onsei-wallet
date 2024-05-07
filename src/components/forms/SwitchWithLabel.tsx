import { ReactElement } from "react";
import { Switch, SwitchProps } from "react-native";
import Option from "./Option";

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
    <Option label={label} icon={icon} disabled={disabled}>
      <Switch
        onValueChange={onValueChangeWrapped}
        {...props}
        disabled={disabled}
      />
    </Option>
  );
}
