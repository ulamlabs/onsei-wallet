import { CosmTokenWithBalance } from "@/services/cosmos";
import { formatAmount } from "./formatAmount";
import { formatUsdBalance } from "./formatUsdBalance";

export const calculateTokenUsdBalance = (
  token: Pick<CosmTokenWithBalance, "balance" | "decimals" | "price">,
  balance?: bigint,
) => {
  if (!balance) {
    balance = token.balance;
  }
  return formatUsdBalance(
    token.price *
      +formatAmount(balance, token.decimals, {
        noDecimalSeparator: true,
      }),
  );
};
