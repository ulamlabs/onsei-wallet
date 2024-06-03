import { Column, Loader, Row, TertiaryButton } from "@/components";
import { useTokensStore } from "@/store";
import { Colors, FontWeights } from "@/styles";
import { NavigationProp } from "@/types";
import { useNavigation } from "@react-navigation/native";
import { Setting4 } from "iconsax-react-native";
import TokenBalanceBox from "../../components/TokenBalanceBox";

export default function TokensList() {
  const navigation = useNavigation<NavigationProp>();

  const { tokens, initTokensLoading } = useTokensStore();

  return (
    <>
      <Column>
        {initTokensLoading ? (
          <Row style={{ justifyContent: "center" }}>
            <Loader />
          </Row>
        ) : (
          <>
            {tokens.map((token) => (
              <TokenBalanceBox key={token.id} token={token} />
            ))}
          </>
        )}
      </Column>

      <TertiaryButton
        title="Manage token list"
        icon={Setting4}
        onPress={() => navigation.navigate("Manage Token List")}
        color={Colors.text100}
        textStyle={{ fontFamily: FontWeights.bold }}
      />
    </>
  );
}
