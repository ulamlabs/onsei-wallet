import { Colors } from "@/styles";
import { InfoCircle } from "iconsax-react-native";
import Toast from "./Toast";
import { ToastComponentsProps } from "./types";

export default function ToastInfo({
  description,
  toast,
  duration,
}: ToastComponentsProps) {
  return (
    <Toast
      toast={toast}
      duration={duration}
      icon={<InfoCircle size={18} color={Colors.toastInfoText} />}
    >
      {description}
    </Toast>
  );
}
