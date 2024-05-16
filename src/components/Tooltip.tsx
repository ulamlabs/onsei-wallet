import React, { PropsWithChildren } from "react";
import { Pressable } from "react-native";
import Modal from "./modals/Modal";

type Props = PropsWithChildren & {
  toggleElement: JSX.Element;
  isVisible: boolean;
  onBackdropPress: () => void;
  onPress?: () => void;
  position?: "top" | "bottom";
  transparentBg?: boolean;
  getTopPosition?: React.Dispatch<React.SetStateAction<number>>;
};

export default function Tooltip({
  children,
  toggleElement,
  isVisible,
  onBackdropPress,
  onPress,
  position,
  transparentBg = false,
  getTopPosition,
}: Props) {
  const measureTop = (pageY: number) => {
    if (!getTopPosition) {
      return;
    }
    getTopPosition(pageY);
  };

  return (
    <>
      <Pressable
        onLayout={(e) =>
          e.target.measure((x, y, width, height, pageX, pageY) => {
            measureTop(pageY);
          })
        }
        onPress={onPress}
      >
        {toggleElement}
      </Pressable>
      <Modal
        position={position}
        isVisible={isVisible}
        onBackdropPress={onBackdropPress}
        transparentBg={transparentBg}
      >
        {children}
      </Modal>
    </>
  );
}
