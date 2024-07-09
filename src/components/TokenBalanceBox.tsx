import { CosmTokenWithBalance } from "@/services/cosmos";
import { Colors, FontSizes, FontWeights } from "@/styles";
import { calculateTokenUsdBalance, formatAmount } from "@/utils";
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
        <View style={{ alignItems: "flex-end" }}>
          {token.price ? (
            <Text
              style={{
                fontFamily: FontWeights.bold,
                marginBottom: 2,
                fontSize: FontSizes.base,
              }}
            >
              ${calculateTokenUsdBalance(token)}
            </Text>
          ) : (
            <></>
          )}
          <Text style={{ color: Colors.text100 }}>
            {formatAmount(token.balance, token.decimals)}
          </Text>
        </View>
      </TokenBox>
    </Pressable>
  );
}
