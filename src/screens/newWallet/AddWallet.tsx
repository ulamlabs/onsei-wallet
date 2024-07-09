import { Column, PrimaryButton, TertiaryButton } from "@/components";
import { useAuthStore } from "@/store";
import { NavigationProp } from "@/types";
import { useNavigation } from "@react-navigation/native";

export default function AddWallet() {
  const navigation = useNavigation<NavigationProp>();
  const { state } = useAuthStore();

  function onCreateNew() {
    if (state === "noPin" || state === "notReady") {
      navigation.navigate("Enable Passcode", {
        nextRoute: "Generate Wallet",
        isOnboarding: true,
      });
      return;
    }

    navigation.navigate("Generate Wallet");
  }
  function onImport() {
    if (state === "noPin" || state === "notReady") {
      navigation.navigate("Enable Passcode", {
        nextRoute: "Import Wallet",
        isOnboarding: true,
      });
      return;
    }

    navigation.navigate("Import Wallet");
  }

  return (
    <Column>
      <PrimaryButton title="Create new wallet" onPress={onCreateNew} />
      <TertiaryButton title="I already have a wallet" onPress={onImport} />
    </Column>
  );
}
