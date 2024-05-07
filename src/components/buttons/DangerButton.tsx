import { Colors } from "@/styles";
import BaseButton, { BaseButtonProps } from "./BaseButton";

export default function DangerButton({
  style: styles,
  ...props
}: BaseButtonProps) {
  return (
    <BaseButton
      {...props}
      style={[{ backgroundColor: Colors.danger }, styles]}
    />
  );
}
