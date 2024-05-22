import { CosmTokenWithBalance } from "@/services/cosmos";
import { Colors, FontWeights } from "@/styles";
import { formatAmount, formatUsdBalance } from "@/utils";
import { Pressable, View } from "react-native";
import TokenBox from "./TokenBox";
import { Text } from "./typography";

type TokenBalanceBoxProps = {
  token: CosmTokenWithBalance;
  onPress?: (token: CosmTokenWithBalance) => void;
};

export default function TokenBalanceBox({
  token,
  onPress,
}: TokenBalanceBoxProps) {
  function onPressWrapped() {
    if (onPress) {
      onPress(token);
    }
  }

  return (
    <Pressable onPress={onPressWrapped}>
      <TokenBox token={token}>
        {token.usdBalance ? (
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ fontFamily: FontWeights.bold }}>
              ${formatUsdBalance(token.usdBalance)}
            </Text>
            <Text
              style={{ fontFamily: FontWeights.bold, color: Colors.text100 }}
            >
              {formatAmount(token.balance, token.decimals)}
            </Text>
          </View>
        ) : (
          <Text style={{ fontFamily: FontWeights.bold, color: Colors.text100 }}>
            {formatAmount(token.balance, token.decimals)}
          </Text>
        )}
      </TokenBox>
    </Pressable>
  );
}
