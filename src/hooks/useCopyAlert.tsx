import { useModalStore } from "@/store";
import { Colors, FontWeights } from "@/styles";
import { SecuritySafe } from "iconsax-react-native";
import React from "react";
import { Text } from "react-native";

export function useCopyAlert() {
  const { alert } = useModalStore();

  const showCopyAlert = () => {
    alert({
      title: "Paste it in a safe place",
      description: (
        <>
          <Text style={{ fontFamily: FontWeights.bold, color: Colors.text100 }}>
            Password Manager
          </Text>
          <Text style={{ color: Colors.text100 }}>
            is a great option. Visiting unsecured sites poses a risk to
            clipboard data.
          </Text>
        </>
      ),
      ok: "Got it",
      icon: SecuritySafe,
    });
  };

  return showCopyAlert;
}
