import { Colors } from "@/styles";
import { InfoCircle } from "iconsax-react-native";
import Toast from "./Toast";
import { ToastComponentsProps } from "./types";

export default function ToastWarning({
  description,
  toast,
  duration,
}: ToastComponentsProps) {
  return (
    <Toast
      toast={toast}
      style={{
        borderColor: Colors.toastWarningBorder,
        backgroundColor: Colors.toastWarningBackground,
      }}
      duration={duration}
      icon={
        <InfoCircle size={18} color={Colors.toastWarningText} rotation={180} />
      }
      textColor={Colors.toastWarningText}
    >
      {description}
    </Toast>
  );
}
