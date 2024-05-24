import { usdPrices } from "@/modules/balances";
import { CosmToken, CosmTokenWithBalance } from "@/services/cosmos";

export function matchPriceToToken(
  token: CosmTokenWithBalance | undefined | CosmToken,
  price: usdPrices,
) {
  return token?.id === price.id || token?.coingeckoId === price.id;
}
