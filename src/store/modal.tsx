import { Icon } from "iconsax-react-native";
import { ReactElement } from "react";
import { StyleProp, TextStyle } from "react-native";
import { create } from "zustand";

export type AlertOptions = {
  title?: string;
  description: ReactElement | string;
  ok?: string;
  icon?: Icon;
};

export type AskOptions = {
  title: string;
  question: string | ReactElement;
  yes: string;
  no: string;
  primary: "yes" | "no";
  icon?: Icon;
  danger?: boolean;
  headerStyle?: StyleProp<TextStyle>;
};

export type Question = {
  type: "question";
  options: AskOptions;
  resolve: (result: boolean) => void;
};
export type Alert = {
  type: "alert";
  options: AlertOptions;
  resolve: () => void;
};
export type ModalInfo = Question | Alert;

export type ModalStore = {
  modals: ModalInfo[];
  ask: (options: AskOptions) => Promise<boolean>;
  alert: (options: AlertOptions) => Promise<void>;
  _pushModal: (modal: ModalInfo) => void;
};

export const useModalStore = create<ModalStore>((set, get) => ({
  modals: [],
  ask: (options: AskOptions) => {
    return new Promise((resolve) => {
      const question: Question = {
        type: "question",
        options,
        resolve: (result: boolean) => {
          resolve(result);
          // TODO make removing a modal more sophisticated. Instead of just removing the first item, make sure to remove the correct modal.
          set({ modals: get().modals.slice(1) });
        },
      };
      get()._pushModal(question);
    });
  },
  alert: (options: AlertOptions) => {
    return new Promise((resolve) => {
      const alert: Alert = {
        type: "alert",
        options,
        resolve: () => {
          resolve();
          set({ modals: get().modals.slice(1) });
        },
      };
      get()._pushModal(alert);
    });
  },
  _pushModal: (modal: ModalInfo) => {
    set((state) => {
      return { modals: [...state.modals, modal] };
    });
  },
}));
