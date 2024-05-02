import { Colors } from "@/styles";
import BaseButton, { BaseButtonProps } from "./BaseButton";

export default function PrimaryButton({
  style: styles,
  textStyle: textStyles,
  ...props
}: BaseButtonProps) {
  return (
    <BaseButton
      {...props}
      style={[{ backgroundColor: Colors.text }, styles]}
      textStyle={[{ color: Colors.background }, textStyles]}
    />
  );
}
