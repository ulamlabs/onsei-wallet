import { create } from "zustand";

export type ToastOptions = {
  description: string;
  duration?: number;
};

export type ToastsTypes = "info" | "error" | "success" | "warning";

export type Toasts = {
  options: ToastOptions;
  resolve: () => void;
  id: string;
  type: ToastsTypes;
};

export type ToastStore = {
  toasts: Toasts[];
  info: (options: ToastOptions) => Promise<void>;
  error: (options: ToastOptions) => Promise<void>;
  warning: (options: ToastOptions) => Promise<void>;
  success: (options: ToastOptions) => Promise<void>;
  _pushtoast: (toast: Toasts) => void;
  _createToast: (options: ToastOptions, type: ToastsTypes) => Promise<void>;
};

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  info: (options) => get()._createToast(options, "info"),
  error: (options) => get()._createToast(options, "error"),
  warning: (options) => get()._createToast(options, "warning"),
  success: (options) => get()._createToast(options, "success"),
  _pushtoast: (toast) => {
    set((state) => {
      return { toasts: [...state.toasts, toast] };
    });
  },
  _createToast: (options, type) => {
    return new Promise<void>((resolve) => {
      const id = `${options.description}-${get().toasts.length}`;
      const toast: Toasts = {
        id,
        type,
        options,
        resolve: () => {
          resolve();
          set({ toasts: get().toasts.filter((toast) => toast.id !== id) });
        },
      };
      get()._pushtoast(toast);
    });
  },
}));
