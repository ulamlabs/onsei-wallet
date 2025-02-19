import { useState, useEffect } from "react";
import { View } from "react-native";

export type AnchorPosition = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type UseAnchorPositionProps = {
  ref: React.RefObject<View>;
  visible: boolean;
  offsetY?: number;
};

export const useAnchorPosition = ({
  ref,
  visible,
  offsetY = 0,
}: UseAnchorPositionProps) => {
  const [anchorPosition, setAnchorPosition] = useState<AnchorPosition | null>(
    null,
  );

  useEffect(() => {
    if (visible && ref.current) {
      ref.current.measureInWindow((x, y, width, height) => {
        setAnchorPosition({
          x,
          y: y + height + offsetY,
          width,
          height,
        });
      });
    } else {
      setAnchorPosition(null);
    }
  }, [visible, ref, offsetY]);

  return anchorPosition;
};
