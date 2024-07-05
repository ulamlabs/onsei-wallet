import { CosmToken } from "@/services/cosmos";
import { Switch, TokenBox } from "@/components";

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
    <TokenBox token={token} showId={true}>
      <Switch
        testID={`${token.symbol}-switch`}
        onValueChange={onToggle}
        value={selected}
      />
    </TokenBox>
  );
}
