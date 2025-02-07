import { Colors } from "@/styles";
import BaseButton, { BaseButtonProps } from "./BaseButton";

export default function PrimaryButton({
  style: styles,
  disabled,
  ...props
}: BaseButtonProps) {
  return (
    <BaseButton
      {...props}
      color={disabled ? Colors.disabledButtonText : Colors.background}
      style={[
        {
          backgroundColor: disabled
            ? Colors.disabledPrimaryButtonBackground
            : Colors.text,
        },
        styles,
      ]}
      disabled={disabled}
      textStyle={{ fontSize: 16 }}
    />
  );
}
