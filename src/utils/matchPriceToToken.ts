import { usdPrices } from "@/modules/prices";
import { CosmToken, CosmTokenWithBalance } from "@/services/cosmos";

export function matchPriceToToken(
  token: CosmTokenWithBalance | CosmToken,
  price: usdPrices,
) {
  return token?.id === price.id || token?.coingeckoId === price.id;
}
