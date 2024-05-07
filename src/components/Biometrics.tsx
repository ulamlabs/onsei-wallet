import { useEffect } from "react";
import * as LocalAuthentication from "expo-local-authentication";
import { APP_NAME } from "@/const";

export type BiometricsProps = {
  onSuccess: () => void;
  onNotEnrolled?: () => void;
};

export default function Biometrics({
  onSuccess,
  onNotEnrolled,
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
      }
    }

    biometrics();
  }, []);

  return <></>;
}
