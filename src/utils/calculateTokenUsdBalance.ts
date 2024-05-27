import { CosmTokenWithBalance } from "@/services/cosmos";
import { formatAmount } from "./formatAmount";
import { formatUsdBalance } from "./formatUsdBalance";

export const calculateTokenUsdBalance = (token: CosmTokenWithBalance) => {
  return formatUsdBalance(
    token.price! *
      +formatAmount(token.balance, token.decimals, {
        noDecimalSeparator: true,
      }),
  );
};
