import { Toasts } from "@/store";

export type ToastComponentsProps = {
  isVisible: boolean;
  description: string;
  toast: Toasts;
};
