import { CosmToken } from "@/services/cosmos";
import { chunkArray } from "@/utils";
import { get } from "../api";
import {
  coinGeckoCategoryResponse,
  coinGeckoPrice,
  geckoTerminalResponse,
  usdPrices,
} from "./types";

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

  const { data: coinGeckoCategory } =
    await get<coinGeckoCategoryResponse[]>(coinGeckoCategoryUrl);

  const tokensWithoutPrice = tokens.filter(
    (token) =>
      !coinGeckoCategory.some(
        (coin) =>
          coin.id.toLowerCase() === token.id.toLowerCase() ||
          coin.name.toLowerCase() === token.name.toLowerCase() ||
          coin.id === token.coingeckoId,
      ),
  );

  const withCoingeckoId = tokensWithoutPrice.filter(
    (token) => token.coingeckoId,
  );
  const addresses = tokensWithoutPrice
    .filter((token) => !token.coingeckoId)
    .map((token) => token.id);

  const chunkedAddresses = chunkArray(addresses, 30);

  const addressPrices =
    chunkedAddresses.length > 0
      ? await Promise.all(
          chunkedAddresses.map(async (addressChunk) => {
            const { data: prices } = await get<geckoTerminalResponse>(
              geckoTerminalUrl(addressChunk),
            );
            return prices.data.attributes.token_prices;
          }),
        )
      : [];

  const coinGeckoIdPrices =
    withCoingeckoId.length > 0
      ? await Promise.all(
          withCoingeckoId.map(async (token) => {
            const price = await getUSDPrice(token);
            return { ...token, price };
          }),
        )
      : [];

  const structuredAddressPrices = addresses.map((address) => ({
    id: address,
    price: addressPrices.find((addressPrice) => addressPrice)?.[address] || 0,
  }));

  const structuredCoinGeckoCategory = coinGeckoCategory.map((coin) => ({
    id: coin.id,
    name: coin.name,
    price: coin.current_price,
  }));

  const structuredGeckoIdPrices = coinGeckoIdPrices.map((coin) => ({
    id: coin.id,
    name: coin.name,
    price: coin.price,
  }));

  const result: usdPrices[] = [
    ...structuredCoinGeckoCategory,
    ...structuredAddressPrices,
    ...structuredGeckoIdPrices,
  ];

  return result;
};
