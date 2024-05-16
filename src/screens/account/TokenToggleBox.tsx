import { CosmToken } from "@/services/cosmos";
import { TokenBox } from "@/components";
import { Switch } from "react-native";

type TokenToggleProps = {
  token: CosmToken;
  selected: boolean;
  onToggle: () => void;
};

export default function TokenToggleBox({
  token,
  selected,
  onToggle,
}: TokenToggleProps) {
  return (
    <TokenBox token={token}>
      <Switch onValueChange={onToggle} value={selected} />
    </TokenBox>
  );
}
