import { Colors } from "@/styles";
import { InfoCircle } from "iconsax-react-native";
import Toast from "./Toast";
import { ToastComponentsProps } from "./types";

export default function ToastInfo({
  description,
  toast,
}: ToastComponentsProps) {
  return (
    <Toast
      toast={toast}
      icon={<InfoCircle size={18} color={Colors.toastInfoText} />}
    >
      {description}
    </Toast>
  );
}
