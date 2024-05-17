import { CosmToken } from "@/services/cosmos";
import { Colors, FontWeights } from "@/styles";
import { formatTokenAmount } from "@/utils/formatAmount";
import { Pressable } from "react-native";
import TokenBox from "./TokenBox";
import { Text } from "./typography";

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
          {formatTokenAmount(token.balance, token.decimals)}
        </Text>
      </TokenBox>
    </Pressable>
  );
}
