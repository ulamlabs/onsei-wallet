import { Colors } from "@/styles";
import { TickCircle } from "iconsax-react-native";
import Toast from "./Toast";
import { ToastComponentsProps } from "./types";

export default function ToastSuccess({
  description,
  toast,
  duration,
}: ToastComponentsProps) {
  return (
    <Toast
      toast={toast}
      style={{
        borderColor: Colors.toastSuccessBorder,
        backgroundColor: Colors.toastSuccessBackground,
      }}
      duration={duration}
      icon={<TickCircle size={18} color={Colors.toastSuccessText} />}
      textColor={Colors.toastSuccessText}
    >
      {description}
    </Toast>
  );
}
