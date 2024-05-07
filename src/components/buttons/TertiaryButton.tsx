import BaseButton, { BaseButtonProps } from "./BaseButton";

export default function TertiaryButton({
  textStyle,
  ...props
}: BaseButtonProps) {
  return (
    <BaseButton textStyle={[{ fontWeight: "400" }, textStyle]} {...props} />
  );
}
