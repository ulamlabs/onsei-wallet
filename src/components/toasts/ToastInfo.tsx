import { Colors, FontWeights } from "@/styles";
import { InfoCircle } from "iconsax-react-native";
import { Row } from "../layout";
import { Text } from "../typography";
import Toast from "./Toast";
import { ToastComponentsProps } from "./types";

export default function ToastInfo({
  isVisible,
  description,
  toast,
}: ToastComponentsProps) {
  return (
    <Toast isVisible={isVisible} toast={toast}>
      <Row>
        <Row style={{ gap: 10 }}>
          <InfoCircle size={18} color={Colors.toastInfoText} />
          <Text
            style={{
              color: Colors.toastInfoText,
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
