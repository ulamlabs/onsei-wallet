import { Colors, FontWeights } from "@/styles";
import { InfoCircle } from "iconsax-react-native";
import { Row } from "../layout";
import { Text } from "../typography";
import Toast from "./Toast";
import { ToastComponentsProps } from "./types";

export default function ToastWarning({
  isVisible,
  description,
  toast,
}: ToastComponentsProps) {
  return (
    <Toast
      isVisible={isVisible}
      toast={toast}
      style={{
        borderColor: Colors.toastWarningBorder,
        backgroundColor: Colors.toastWarningBackground,
      }}
    >
      <Row>
        <Row style={{ gap: 10 }}>
          <InfoCircle
            size={18}
            color={Colors.toastWarningText}
            rotation={180}
          />
          <Text
            style={{
              color: Colors.toastWarningText,
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
