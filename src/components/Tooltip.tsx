import React, { PropsWithChildren } from "react";
import { Pressable } from "react-native";
import Modal from "./modals/Modal";

type Props = PropsWithChildren & {
  toggleElement: JSX.Element;
  isVisible: boolean;
  onBackdropPress: () => void;
  onPress?: () => void;
  position?: "top" | "bottom";
};

export default function Tooltip({
  children,
  toggleElement,
  isVisible,
  onBackdropPress,
  onPress,
  position,
}: Props) {
  return (
    <>
      <Pressable onPress={onPress}>{toggleElement}</Pressable>
      <Modal
        position={position}
        isVisible={isVisible}
        onBackdropPress={onBackdropPress}
      >
        {children}
      </Modal>
    </>
  );
}
