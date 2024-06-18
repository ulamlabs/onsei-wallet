import { Colors } from "@/styles";
import { TickCircle } from "iconsax-react-native";
import Toast from "./Toast";
import { ToastComponentsProps } from "./types";

export default function ToastSuccess({
  description,
  toast,
}: ToastComponentsProps) {
  return (
    <Toast
      toast={toast}
      style={{
        borderColor: Colors.toastSuccessBorder,
        backgroundColor: Colors.toastSuccessBackground,
      }}
      icon={<TickCircle size={18} color={Colors.toastSuccessText} />}
      textColor={Colors.toastSuccessText}
    >
      {description}
    </Toast>
  );
}
