import { Colors } from "@/styles";
import BaseButton, { BaseButtonProps } from "./BaseButton";
import React from "react";
import { View } from "react-native";

type IconButtonProps = Omit<BaseButtonProps, "ref">;

const IconButton = React.forwardRef<View, IconButtonProps>(
  ({ style, ...props }, ref) => {
    return (
      <BaseButton
        {...props}
        ref={ref}
        style={[
          {
            height: 38,
            width: 38,
            paddingVertical: 8,
            paddingHorizontal: 8,
            borderRadius: 14,
            backgroundColor: Colors.background200,
          },
          style,
        ]}
      />
    );
  },
);

IconButton.displayName = "IconButton";

export default IconButton;
