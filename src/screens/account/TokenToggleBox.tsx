import { CosmToken } from "@/services/cosmos";
import { TokenBox } from "@/components";
import { Switch } from "react-native";
import { Colors } from "@/styles";

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
      <Switch
        onValueChange={onToggle}
        value={selected}
        trackColor={{
          true: Colors.labelBackground,
          false: Colors.activeInputBorderColor,
        }}
        ios_backgroundColor={Colors.activeInputBorderColor}
      />
    </TokenBox>
  );
}
