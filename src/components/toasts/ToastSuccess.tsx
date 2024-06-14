import { Colors, FontWeights } from "@/styles";
import { TickCircle } from "iconsax-react-native";
import { Row } from "../layout";
import { Text } from "../typography";
import Toast from "./Toast";
import { ToastComponentsProps } from "./types";

export default function ToastSuccess({
  isVisible,
  description,
  toast,
}: ToastComponentsProps) {
  return (
    <Toast
      isVisible={isVisible}
      toast={toast}
      style={{
        borderColor: Colors.toastSuccessBorder,
        backgroundColor: Colors.toastSuccessBackground,
      }}
    >
      <Row>
        <Row style={{ gap: 10 }}>
          <TickCircle size={18} color={Colors.toastSuccessText} />
          <Text
            style={{
              color: Colors.toastSuccessText,
              fontFamily: FontWeights.medium,
            }}
          >
            {description}
          </Text>
        </Row>
      </Row>
    </Toast>
  );
}
