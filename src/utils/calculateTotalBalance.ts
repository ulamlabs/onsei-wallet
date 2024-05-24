import { CosmTokenWithBalance } from "@/services/cosmos";
import { calculateTokenUsdBalance } from "./calculateTokenUsdBalance";
import { formatUsdBalance } from "./formatUsdBalance";

export const calculateTotalBalance = (tokens: CosmTokenWithBalance[]) => {
  const totalUSDBalance = formatUsdBalance(
    tokens
      .map((token) => (token.price ? calculateTokenUsdBalance(token) : 0))
      .reduce((total, current) => total + current, 0),
  );

  return totalUSDBalance;
};
