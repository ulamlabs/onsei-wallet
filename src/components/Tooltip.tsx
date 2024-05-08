import React, { PropsWithChildren } from "react";
import { Pressable } from "react-native";
import Modal from "./modals/Modal";

type Props = PropsWithChildren & {
  toggleElement: JSX.Element;
  isVisible: boolean;
  onBackdropPress: () => void;
  onPress?: () => void;
};

export default function Tooltip({
  children,
  toggleElement,
  isVisible,
  onBackdropPress,
  onPress,
}: Props) {
  return (
    <>
      <Pressable onPress={onPress}>{toggleElement}</Pressable>
      <Modal isVisible={isVisible} onBackdropPress={onBackdropPress}>
        {children}
      </Modal>
    </>
  );
}
