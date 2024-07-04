import { APP_NAME } from "@/const";
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
      } else if (onNotEnrolled && result.error === "not_enrolled") {
        onNotEnrolled();
      } else if (onCancel) {
        onCancel();
      }
    }

    biometrics();
  }, []);

  return <></>;
}
