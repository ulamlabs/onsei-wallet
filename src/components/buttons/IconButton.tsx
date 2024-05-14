import { Colors } from "@/styles";
import BaseButton, { BaseButtonProps } from "./BaseButton";

export default function IconButton({
  style: styles,
  ...props
}: BaseButtonProps) {
  return (
    <BaseButton
      {...props}
      style={[
        {
          height: 38,
          width: 38,
          paddingVertical: 8,
          paddingHorizontal: 8,
          borderRadius: 14,
          backgroundColor: Colors.background200,
        },
        styles,
      ]}
    />
  );
}
