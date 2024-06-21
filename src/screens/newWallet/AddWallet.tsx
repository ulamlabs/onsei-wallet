import { Column, PrimaryButton, TertiaryButton } from "@/components";
import { NavigationProp } from "@/types";
import { useNavigation } from "@react-navigation/native";

export default function AddWallet() {
  const navigation = useNavigation<NavigationProp>();

  function onCreateNew() {
    navigation.navigate("Generate Wallet");
  }
  function onImport() {
    navigation.navigate("Import Wallet");
  }

  return (
    <Column>
      <PrimaryButton title="Create new wallet" onPress={onCreateNew} />
      <TertiaryButton title="I already have a wallet" onPress={onImport} />
    </Column>
  );
}
