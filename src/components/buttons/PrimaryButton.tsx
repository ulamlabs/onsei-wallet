import { Colors } from "@/styles";
import BaseButton, { BaseButtonProps } from "./BaseButton";

export default function PrimaryButton({
  style: styles,
  ...props
}: BaseButtonProps) {
  return (
    <BaseButton
      {...props}
      color={Colors.background}
      style={[{ backgroundColor: Colors.text }, styles]}
      textStyle={{ fontSize: 16 }}
    />
  );
}
