import { CosmTokenWithBalance } from "@/services/cosmos";
import { formatAmount } from "./formatAmount";
import { formatUsdBalance } from "./formatUsdBalance";

export const calculateTokenUsdBalance = (
  token: CosmTokenWithBalance,
  amount?: bigint,
) => {
  return formatUsdBalance(
    token.price! *
      +formatAmount(amount || token.balance, token.decimals, {
        noDecimalSeparator: true,
      }),
  );
};
