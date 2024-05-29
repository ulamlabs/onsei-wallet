import { Colors, FontWeights } from "@/styles";
import BaseButton, { BaseButtonProps } from "./BaseButton";

export default function SmallButton({
  textStyle,
  style,
  ...props
}: BaseButtonProps) {
  return (
    <BaseButton
      style={[
        {
          paddingHorizontal: 18,
          paddingVertical: 12,
          backgroundColor: Colors.background200,
        },
        style,
      ]}
      textStyle={[{ fontFamily: FontWeights.regular, fontSize: 16 }, textStyle]}
      {...props}
    />
  );
}
