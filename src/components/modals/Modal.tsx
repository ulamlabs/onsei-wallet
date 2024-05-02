import { Colors } from "@/styles";
import { PropsWithChildren, useEffect, useRef } from "react";
import { Animated, Pressable, Modal as ReactModal } from "react-native";

type ModalProps = PropsWithChildren & {
  isVisible: boolean;
  onBackdropPress?: () => void;
};

export default function Modal({
  isVisible,
  children,
  onBackdropPress,
}: ModalProps) {
  const translateY = useRef(new Animated.Value(200)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: isVisible ? 0 : 200,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible, translateY]);

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
            backgroundColor: Colors.background,
            padding: 10,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            transform: [{ translateY }],
            borderColor: Colors.inputBorderColor,
            borderTopWidth: 2,
            borderLeftWidth: 2,
            borderRightWidth: 2,
          }}
        >
          {children}
        </Animated.View>
      </Pressable>
    </ReactModal>
  );
}
