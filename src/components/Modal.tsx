import tw from "@/lib/tailwind";
import { PropsWithChildren } from "react";
import { Modal, Text, View } from "react-native";
import Button from "./Button";
import SafeLayout from "./SafeLayout";

type ModalProps = PropsWithChildren & {
  isVisible: boolean;
  title: string;
  description: string;
  buttonTxt: string;
  confirmBtnDisabled?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
};

export default ({
  isVisible,
  title,
  description,
  buttonTxt,
  confirmBtnDisabled = false,
  onConfirm,
  onCancel,
  children,
}: ModalProps) => {
  return (
    <Modal
      visible={isVisible}
      supportedOrientations={["landscape", "portrait"]}
      animationType="fade"
    >
      <SafeLayout>
        <View style={tw`h-full items-center justify-center`}>
          <Text style={tw`text-3xl font-bold text-white mb-3`}>{title}</Text>
          <Text style={tw`text-center text-white mb-5`}>{description}</Text>

          {children}

          <View style={tw`flex-row gap-4`}>
            {onCancel && (
              <Button
                styles={tw``}
                type="danger"
                onPress={onCancel}
                label="Cancel"
              />
            )}
            <Button
              disabled={confirmBtnDisabled}
              onPress={onConfirm}
              label={buttonTxt}
            />
          </View>
        </View>
      </SafeLayout>
    </Modal>
  );
};
