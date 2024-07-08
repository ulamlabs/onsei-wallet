import { Colors, FontWeights } from "@/styles";
import BaseButton, { BaseButtonProps } from "./BaseButton";

export default function SecondaryButton({
  style: styles,
  ...props
}: BaseButtonProps) {
  return (
    <BaseButton
      {...props}
      style={[{ borderColor: Colors.text, borderWidth: 1 }, styles]}
      textStyle={{ fontFamily: FontWeights.medium }}
    />
  );
}
