import { Text } from "@/components";
import { CosmToken } from "@/services/cosmos";
import Token from "./Token";

type TokenInfoProps = {
  token: CosmToken;
};

export default function TokenBalance({ token }: TokenInfoProps) {
  return (
    <Token token={token}>
      <Text style={{ fontWeight: "bold" }}>0.0</Text>
    </Token>
  );
}
