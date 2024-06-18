import { Toasts as ToastsType, useToastStore } from "@/store";
import { scale } from "@/utils";
import { useNavigationState } from "@react-navigation/native";
import { SafeAreaView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
  const insets = useSafeAreaInsets();
  const routes = useNavigationState((state) => state?.routes);
  const currentRoute = routes?.[routes?.length - 1].name;

  return (
    <SafeAreaView
      style={{
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        bottom: currentRoute === "Home" ? 110 : 30,
        left: Math.max(scale(16), insets.left),
        right: Math.max(scale(16), insets.right),
        gap: 5,
        flexDirection: "column-reverse",
      }}
    >
      {toastsStore.toasts.map((toast: ToastsType) => {
        const ToastComponent = toastComponents[toast.type];
        return (
          <ToastComponent
            key={toast.id}
            description={toast.options.description}
            toast={toast}
            duration={toast.options.duration}
          />
        );
      })}
    </SafeAreaView>
  );
}
