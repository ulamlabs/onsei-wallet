import { Colors } from "@/styles";
import { PropsWithChildren, useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  Modal as ReactModal,
  TouchableWithoutFeedback,
} from "react-native";

type ModalProps = PropsWithChildren & {
  isVisible: boolean;
  onBackdropPress?: () => void;
  position?: "top" | "bottom";
  transparentBg?: boolean;
};

export default function Modal({
  isVisible,
  children,
  onBackdropPress,
  position = "bottom",
  transparentBg,
}: ModalProps) {
  const translateY = useRef(new Animated.Value(200)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: isVisible ? 0 : position === "bottom" ? 200 : -200,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  return (
    <ReactModal
      visible={isVisible}
      supportedOrientations={["landscape", "portrait"]}
      animationType="fade"
      transparent={true}
    >
      <Pressable
        style={{
          backgroundColor: "rgba(0,0,0,0.7)",
          flex: 1,
          justifyContent: "flex-end",
          marginLeft: -3,
          marginRight: -3,
        }}
        onPress={onBackdropPress}
      >
        <Animated.View
          style={{
            backgroundColor: transparentBg ? "" : Colors.background,
            paddingVertical: 24,
            paddingHorizontal: 16,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            transform: [{ translateY }],
            borderColor: transparentBg ? "" : Colors.inputBorderColor,
            borderTopWidth: 2,
            borderLeftWidth: 2,
            borderRightWidth: 2,
          }}
        >
          <TouchableWithoutFeedback>{children}</TouchableWithoutFeedback>
        </Animated.View>
      </Pressable>
    </ReactModal>
  );
}
