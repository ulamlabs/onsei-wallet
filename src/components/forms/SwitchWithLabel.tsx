import { ReactElement } from "react";
import { SwitchProps } from "react-native";
import Option from "./Option";
import Switch from "./Switch";

export type SwithWithLabelProps = SwitchProps & {
  label: string;
  icon?: ReactElement;
};

export default function SwitchWithLabel({
  label,
  icon,
  disabled,
  ...props
}: SwithWithLabelProps) {
  return (
    <Option label={label} icon={icon} disabled={disabled}>
      <Switch {...props} disabled={disabled} />
    </Option>
  );
}
