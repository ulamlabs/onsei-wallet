import { APP_NAME } from "@/const";
import { useModalStore } from "@/store";
import * as LocalAuthentication from "expo-local-authentication";
import { useEffect } from "react";

export type BiometricsProps = {
  onSuccess: () => void;
  onNotEnrolled?: () => void;
  onCancel?: () => void;
};

export default function Biometrics({
  onSuccess,
  onNotEnrolled,
  onCancel,
}: BiometricsProps) {
  const { alert } = useModalStore();
  useEffect(() => {
    async function biometrics() {
      const result = await LocalAuthentication.authenticateAsync({
        disableDeviceFallback: true,
        promptMessage: APP_NAME,
        cancelLabel: "Cancel",
        requireConfirmation: false,
      });
      if (result.success) {
        onSuccess();
        return;
      } else if (onNotEnrolled && result.error === "not_enrolled") {
        onNotEnrolled();
        return;
      } else if (onCancel) {
        onCancel();
        return;
      }

      alert({
        title: "Biometrics failed",
        description:
          "Check your biometric settings and try again from the application menu.",
      });
    }

    biometrics();
  }, []);

  return <></>;
}
