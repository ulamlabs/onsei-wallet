import { CosmTokenWithBalance } from "@/services/cosmos";

export const calculateTotalBalance = (tokens: CosmTokenWithBalance[]) => {
  const totalUSDBalance = tokens
    .map((token) => token.usdBalance || 0)
    .reduce((total, current) => total + current, 0);

  return totalUSDBalance;
};
