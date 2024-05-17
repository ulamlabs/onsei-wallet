import { FontWeights } from "@/styles";
import BaseButton, { BaseButtonProps } from "./BaseButton";

export default function TertiaryButton({
  textStyle,
  ...props
}: BaseButtonProps) {
  return (
    <BaseButton
      textStyle={[{ fontFamily: FontWeights.regular, fontSize: 16 }, textStyle]}
      {...props}
    />
  );
}
