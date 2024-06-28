import { useModalStore } from "@/store";
import { Colors, FontWeights } from "@/styles";
import { SecuritySafe } from "iconsax-react-native";
import React from "react";
import { Text } from "react-native";

export function useCopyAlert() {
  const { ask } = useModalStore();

  const showCopyAlert = async () => {
    const yesno = await ask({
      title: "Paste it in a safe place",
      question: (
        <Text>
          <Text
            style={{
              fontFamily: FontWeights.bold,
              color: Colors.text100,
            }}
          >
            Password Manager{" "}
          </Text>
          <Text style={{ color: Colors.text100 }}>
            is a great option. Visiting unsecured sites poses a risk to
            clipboard data.
          </Text>
        </Text>
      ),
      yes: "Got it",
      no: "Cancel",
      primary: "yes",
      icon: SecuritySafe,
      headerStyle: { textAlign: "left" },
    });
    return yesno;
  };

  return showCopyAlert;
}
