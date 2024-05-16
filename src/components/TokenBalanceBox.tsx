import { CosmToken } from "@/services/cosmos";
import { Colors, FontWeights } from "@/styles";
import TokenBox from "./TokenBox";
import { formatAmount } from "@/utils";
import { Text } from "./typography";
import { Pressable } from "react-native";

type TokenBalanceBoxProps = {
  token: CosmToken;
  onPress?: (token: CosmToken) => void;
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
        <Text style={{ fontFamily: FontWeights.bold, color: Colors.text100 }}>
          {formatAmount(token.balance, token.decimals)}
        </Text>
      </TokenBox>
    </Pressable>
  );
}
