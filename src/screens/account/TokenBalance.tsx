import { Text } from "@/components";
import { CosmToken } from "@/services/cosmos";
import Token from "./Token";
import { formatTokenAmount } from "@/utils/formatAmount";

type TokenInfoProps = {
  token: CosmToken;
};

export default function TokenBalance({ token }: TokenInfoProps) {
  return (
    <Token token={token}>
      <Text style={{ fontWeight: "bold" }}>
        {formatTokenAmount(token.balance, token.decimals)}
      </Text>
    </Token>
  );
}
