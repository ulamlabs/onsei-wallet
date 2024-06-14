import { Colors, FontWeights } from "@/styles";
import { CloseCircle } from "iconsax-react-native";
import { Row } from "../layout";
import { Text } from "../typography";
import Toast from "./Toast";
import { ToastComponentsProps } from "./types";

export default function ToastError({
  isVisible,
  description,
  toast,
}: ToastComponentsProps) {
  return (
    <Toast
      isVisible={isVisible}
      toast={toast}
      style={{
        borderColor: Colors.toastErrorBorder,
        backgroundColor: Colors.toastErrorBackground,
      }}
    >
      <Row>
        <Row style={{ gap: 10 }}>
          <CloseCircle size={18} color={Colors.toastErrorText} />
          <Text
            style={{
              color: Colors.toastErrorText,
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
