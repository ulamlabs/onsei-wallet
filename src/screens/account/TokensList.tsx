import { Column, TertiaryButton } from "@/components";
import { useTokensStore } from "@/store";
import { Colors, FontWeights } from "@/styles";
import { NavigationProp } from "@/types";
import { useNavigation } from "@react-navigation/native";
import { Setting5 } from "iconsax-react-native";
import TokenBalanceBox from "../../components/TokenBalanceBox";

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
        textStyle={{ fontFamily: FontWeights.bold }}
      />

      <Column>
        {tokens.map((token) => (
          <TokenBalanceBox key={token.id} token={token} />
        ))}
      </Column>
    </>
  );
}
