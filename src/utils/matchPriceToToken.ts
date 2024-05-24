import { usdPrices } from "@/modules/balances";
import { CosmToken, CosmTokenWithBalance } from "@/services/cosmos";

export function matchPriceToToken(
  token: CosmTokenWithBalance | undefined | CosmToken,
  price: usdPrices,
) {
  return (
    token?.id.toLowerCase() === price.id.toLowerCase() ||
    token?.coingeckoId.toLowerCase() === price.id.toLowerCase()
  );
}
