import { CosmToken } from "@/services/cosmos";
import TokenBox from "./TokenBox";
import { formatTokenAmount } from "@/utils/formatAmount";
import { Text } from "./typography";
import { Colors } from "@/styles";
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
        <Text style={{ fontWeight: "bold", color: Colors.text100 }}>
          {formatTokenAmount(token.balance, token.decimals)}
        </Text>
      </TokenBox>
    </Pressable>
  );
}
