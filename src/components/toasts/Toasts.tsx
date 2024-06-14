import { Toasts as ToastsType, useToastStore } from "@/store";
import ToastError from "./ToastError";
import ToastInfo from "./ToastInfo";
import ToastSuccess from "./ToastSuccess";
import ToastWarning from "./ToastWarning";

const toastComponents = {
  info: ToastInfo,
  error: ToastError,
  success: ToastSuccess,
  warning: ToastWarning,
};

export default function Toasts() {
  const toastsStore = useToastStore();

  return (
    <>
      {toastsStore.toasts.map((toast: ToastsType) => {
        const ToastComponent = toastComponents[toast.type];
        return ToastComponent ? (
          <ToastComponent
            key={toast.id}
            isVisible={true}
            description={toast.options.description}
            toast={toast}
          />
        ) : null;
      })}
    </>
  );
}
