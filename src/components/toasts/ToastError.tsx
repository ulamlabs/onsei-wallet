import { Colors } from "@/styles";
import { CloseCircle } from "iconsax-react-native";
import Toast from "./Toast";
import { ToastComponentsProps } from "./types";

export default function ToastError({
  description,
  toast,
}: ToastComponentsProps) {
  return (
    <Toast
      toast={toast}
      style={{
        borderColor: Colors.toastErrorBorder,
        backgroundColor: Colors.toastErrorBackground,
      }}
      icon={<CloseCircle size={18} color={Colors.toastErrorText} />}
      textColor={Colors.toastErrorText}
    >
      {description}
    </Toast>
  );
}
