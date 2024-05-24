import { CosmTokenWithBalance } from "@/services/cosmos";
import { formatUsdBalance } from "./formatUsdBalance";

export const calculateTotalBalance = (tokens: CosmTokenWithBalance[]) => {
  const totalUSDBalance = formatUsdBalance(
    tokens
      .map((token) => token.usdBalance || 0)
      .reduce((total, current) => total + current, 0),
  );

  return totalUSDBalance;
};
