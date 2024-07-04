import { Column, PrimaryButton, TertiaryButton } from "@/components";
import { NavigationProp } from "@/types";
import { useNavigation } from "@react-navigation/native";

export default function AddWallet() {
  const navigation = useNavigation<NavigationProp>();

  function onCreateNew() {
    navigation.navigate("Enable Passcode", {
      nextRoute: "Generate Wallet",
      isOnboarding: true,
    });
  }
  function onImport() {
    navigation.navigate("Enable Passcode", {
      nextRoute: "Import Wallet",
      isOnboarding: true,
    });
  }

  return (
    <Column>
      <PrimaryButton title="Create new wallet" onPress={onCreateNew} />
      <TertiaryButton title="I already have a wallet" onPress={onImport} />
    </Column>
  );
}
