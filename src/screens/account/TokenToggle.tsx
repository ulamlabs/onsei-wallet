import { CosmToken } from "@/services/cosmos";
import Token from "./Token";
import { Switch } from "react-native";

type TokenInfoProps = {
  token: CosmToken;
  selected: boolean;
  onToggle: () => void;
};

export default function TokenToggle({
  token,
  selected,
  onToggle,
}: TokenInfoProps) {
  return (
    <Token token={token}>
      <Switch onValueChange={onToggle} value={selected} />
    </Token>
  );
}
