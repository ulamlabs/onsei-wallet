import { CosmToken } from "@/services/cosmos";
import { chunkArray } from "@/utils";
import { get } from "../api";
import {
  coinGeckoCategoryResponse,
  coinGeckoPrice,
  geckoTerminalResponse,
  usdPrices,
} from "./types";

let coinGeckoIds = new Set<string>();

export const geckoTerminalUrl = (address: string) =>
  `https://api.geckoterminal.com/api/v2/simple/networks/sei-network/token_price/${address}`;

export const getUSDPrice = async (token: CosmToken) => {
  const coingeckoPriceUrl = token.coingeckoId
    ? `https://api.coingecko.com/api/v3/simple/price?ids=${token.coingeckoId}&vs_currencies=usd`
    : `https://api.coingecko.com/api/v3/simple/token_price/sei-network?contract_addresses=${token.id}&vs_currencies=usd`;

  const { data } = await get<coinGeckoPrice>(coingeckoPriceUrl);

  return token.coingeckoId ? data[token.coingeckoId]?.usd : data[token.id]?.usd;
};

export const getUSDPrices = async (tokens: CosmToken[]) => {
  const coinGeckoCategoryUrl =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=sei-ecosystem";

  if (coinGeckoIds.size === 0) {
    const { data: coinGeckoCategory } =
      await get<coinGeckoCategoryResponse[]>(coinGeckoCategoryUrl);

    coinGeckoIds = new Set(
      coinGeckoCategory.map((coin) => coin.id.toLowerCase()),
    );
  }

  const tokensWithoutPrice = tokens.filter((token) => {
    return !coinGeckoIds.has(token.coingeckoId);
  });

  const addresses = tokensWithoutPrice
    .filter((token) => !token.coingeckoId)
    .map((token) => {
      return token.id.replaceAll("/", "%2F");
    });
  const chunkedAddresses = chunkArray(addresses, 30);

  const addressPrices = await Promise.all(
    chunkedAddresses.map(async (addressChunk) => {
      try {
        const { data: prices } = await get<geckoTerminalResponse>(
          geckoTerminalUrl(addressChunk),
        );
        return prices.data.attributes.token_prices;
      } catch (e) {
        return {};
      }
    }),
  );

  const withCoingeckoId = tokensWithoutPrice.filter(
    (token) => token.coingeckoId,
  );

  const coinGeckoIdPrices = await Promise.all(
    withCoingeckoId.map(async (token) => {
      try {
        const price = await getUSDPrice(token);
        return { ...token, price };
      } catch (e) {
        return { ...token, price: 0 };
      }
    }),
  );

  const structuredAddressPrices = addresses.map((address) => ({
    id: address,
    price:
      addressPrices.find((addressPrice) =>
        Object.prototype.hasOwnProperty.call(addressPrice, address),
      )?.[address] || 0,
  }));

  const structuredGeckoIdPrices = coinGeckoIdPrices.map((coin) => ({
    id: coin.id,
    name: coin.name,
    price: coin.price,
  }));

  const result: usdPrices[] = [
    ...structuredAddressPrices,
    ...structuredGeckoIdPrices,
  ];

  return result;
};
