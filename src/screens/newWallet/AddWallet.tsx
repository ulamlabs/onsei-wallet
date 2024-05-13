import { NavigationProp } from "@/types";
import { useNavigation } from "@react-navigation/native";
import { PrimaryButton, TertiaryButton, Column } from "@/components";

export default function AddWallet() {
  const navigation = useNavigation<NavigationProp>();

  function onCreateNew() {
    navigation.push("Generate Wallet");
  }
  function onImport() {
    navigation.push("Import Wallet");
  }

  return (
    <Column>
      <PrimaryButton title="Create new wallet" onPress={onCreateNew} />
      <TertiaryButton title="I already have a wallet" onPress={onImport} />
    </Column>
  );
}
