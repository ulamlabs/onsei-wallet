import { Column, TertiaryButton } from "@/components";
import { useTokensStore } from "@/store";
import { NavigationProp } from "@/types";
import { useNavigation } from "@react-navigation/native";
import TokenBalance from "./TokenBalance";
import { Setting5 } from "iconsax-react-native";
import { Colors } from "@/styles";

export default function TokensList() {
  const navigation = useNavigation<NavigationProp>();

  const { tokens } = useTokensStore();

  return (
    <>
      <TertiaryButton
        title="Manage token list"
        icon={Setting5}
        onPress={() => navigation.navigate("Manage Token List")}
        color={Colors.text100}
        textStyle={{ fontWeight: "bold" }}
      />

      <Column>
        {tokens.map((token) => (
          <TokenBalance key={token.address} token={token} />
        ))}
      </Column>
    </>
  );
}
