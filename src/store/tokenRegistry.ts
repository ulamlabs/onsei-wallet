import { NETWORK_NAMES, NODE_URL } from "@/const";
import { fetchWithRetry } from "@/modules/api";
import { getUSDPrices, usdPrices } from "@/modules/prices";
import { CosmToken, CosmTokenWithPrice } from "@/services/cosmos";
import { loadFromStorage, matchPriceToToken, saveToStorage } from "@/utils";
import { create } from "zustand";
import { useSettingsStore } from "./settings";
import { useToastStore } from "./toast";

type TokenPrice = {
  price: number;
  timestamp: Date;
};

type TokenRegistryStore = {
  tokenRegistry: CosmToken[];
  cw20Registry: CosmToken[];
  erc20Registry: CosmToken[];
  tokenRegistryMap: Map<string, CosmToken>;
  tokenPricesMap: Map<string, TokenPrice>;
  registryRefreshPromise: Promise<void> | null;
  init: () => Promise<void>;
  addCW20ToRegistry: (newToken: CosmToken) => Promise<void>;
  addERC20ToRegistry: (newToken: CosmToken) => Promise<void>;
  getPrices: (tokens: CosmToken[]) => Promise<usdPrices[]>;
  getTokensWithPrices: (tokenIds: string[]) => Promise<CosmTokenWithPrice[]>;
  refreshRegistryCache: () => Promise<void>;
  _refreshRegistryCache: () => Promise<void>;
};

const PRICE_STALE_TIME = 10 * 60 * 1000; // 10 minutes

export const useTokenRegistryStore = create<TokenRegistryStore>((set, get) => ({
  tokenRegistry: [],
  cw20Registry: [],
  erc20Registry: [],
  tokenRegistryMap: new Map(),
  tokenPricesMap: new Map(),
  registryRefreshPromise: null,
  init: async () => {
    const cachedTokenRegistry = await loadFromStorage<CosmToken[]>(
      getRegistryKey(),
      [],
    );
    const cw20Registry = await loadFromStorage<CosmToken[]>(
      getCW20RegistryKey(),
      [],
    );
    set({
      tokenRegistry: cachedTokenRegistry,
      cw20Registry,
      registryRefreshPromise: get()._refreshRegistryCache(),
      tokenRegistryMap: tokensToMap(cachedTokenRegistry),
    });
  },
  addCW20ToRegistry: async (newToken) => {
    const { cw20Registry, tokenRegistry, tokenPricesMap, getPrices } = get();
    const exists = cw20Registry.find((t) => t.id === newToken.id);
    if (exists) {
      return;
    }

    const prices = await getPrices([newToken]);
    const newTokenPrice =
      prices.find((p) => matchPriceToToken(newToken, p))?.price || 0;

    tokenPricesMap.set(newToken.id, {
      price: newTokenPrice,
      timestamp: new Date(),
    });

    const updatedRegistry = [...tokenRegistry, newToken];
    const updatedCW20Registry = [...cw20Registry, newToken];
    saveToStorage(getRegistryKey(), updatedRegistry);
    saveToStorage(getCW20RegistryKey(), updatedCW20Registry);
    set({
      tokenRegistry: updatedRegistry,
      cw20Registry: updatedCW20Registry,
      tokenRegistryMap: tokensToMap(updatedRegistry),
      tokenPricesMap,
    });
  },
  addERC20ToRegistry: async (newToken) => {
    const { erc20Registry, tokenRegistry, tokenPricesMap, getPrices } = get();
    const exists = erc20Registry.find((t) => t.id === newToken.id);
    if (exists) {
      return;
    }
    const prices = await getPrices([newToken]);
    const newTokenPrice =
      prices.find((p) => matchPriceToToken(newToken, p))?.price || 0;

    tokenPricesMap.set(newToken.id, {
      price: newTokenPrice,
      timestamp: new Date(),
    });

    const updatedRegistry = [...tokenRegistry, newToken];
    const updatedErc20Registry = [...erc20Registry, newToken];
    saveToStorage(getRegistryKey(), updatedRegistry);
    saveToStorage(getErc20RegistryKey(), updatedErc20Registry);
    set({
      tokenRegistry: updatedRegistry,
      erc20Registry: updatedErc20Registry,
      tokenRegistryMap: tokensToMap(updatedRegistry),
      tokenPricesMap,
    });
  },
  getPrices: async (tokens) => {
    const { error } = useToastStore.getState();
    try {
      return await getUSDPrices(tokens);
    } catch (e) {
      console.error("error at fetching prices: ", e);
      error({ description: "Error at fetching prices" });
      return [];
    }
  },
  getTokensWithPrices: async (tokenIds) => {
    const {
      tokenRegistryMap,
      tokenPricesMap,
      registryRefreshPromise,
      getPrices,
    } = get();
    const tokenPricesToUpdate = [];
    const tokensWithPrices: CosmTokenWithPrice[] = [];

    for (const tokenId of tokenIds) {
      let token = tokenRegistryMap.get(tokenId);
      if (!token && registryRefreshPromise) {
        await registryRefreshPromise;
        token = get().tokenRegistryMap.get(tokenId);
      }

      if (!token) {
        continue;
      }

      const priceData = tokenPricesMap.get(tokenId);
      if (
        !priceData ||
        new Date().getTime() - priceData.timestamp.getTime() > PRICE_STALE_TIME
      ) {
        tokenPricesToUpdate.push(token);
        continue;
      }
      tokensWithPrices.push({ ...token, price: priceData.price });
    }

    if (tokenPricesToUpdate.length > 0) {
      const newPrices = await getPrices(tokenPricesToUpdate);
      const updatedPricesMap = new Map(tokenPricesMap);
      for (const token of tokenPricesToUpdate) {
        const price =
          newPrices.find((p) => matchPriceToToken(token, p))?.price || 0;
        updatedPricesMap.set(token.id, { price, timestamp: new Date() });
        tokensWithPrices.push({ ...token, price });
      }
      set({ tokenPricesMap: updatedPricesMap });
    }
    return tokensWithPrices;
  },
  refreshRegistryCache: async () => {
    const { _refreshRegistryCache: _refreshCache } = get();
    set({ registryRefreshPromise: _refreshCache(), tokenPricesMap: new Map() });
  },
  _refreshRegistryCache: async () => {
    const [registryTokens, nativeTokens] = await Promise.all([
      fetchRegistry(),
      fetchNativeTokens(),
    ]);
    const registryTokensIds = new Set(registryTokens.map((t) => t.id));
    const uniqueNativeTokens = nativeTokens.filter(
      (t) => !registryTokensIds.has(t.id),
    );

    const tokenRegistry = [
      ...registryTokens,
      ...uniqueNativeTokens,
      ...get().cw20Registry,
    ];

    saveToStorage(getRegistryKey(), tokenRegistry);
    set({
      tokenRegistry,
      tokenRegistryMap: tokensToMap(tokenRegistry),
    });
  },
}));

async function fetchRegistry(): Promise<CosmToken[]> {
  const url =
    "https://raw.githubusercontent.com/Sei-Public-Goods/sei-assetlist/main/assetlist.json";
  try {
    const response = await fetchWithRetry(url);
    const data = await response.json();
    return data[getNetwork()].map(parseRegistryToken);
  } catch (error) {
    useToastStore
      .getState()
      .error({ description: "Failed to fetch registry data" });
    throw error;
  }
}

async function fetchNativeTokens(): Promise<CosmToken[]> {
  const params = new URLSearchParams({
    "pagination.limit": "1000",
  });
  const url = `https://rest.${NODE_URL[getNode()]}/cosmos/bank/v1beta1/denoms_metadata?${params}`;
  let tokens: CosmToken[] = [];
  try {
    while (true) {
      const response = await fetchWithRetry(url);
      const data = await response.json();
      tokens = [...tokens, ...data.metadatas.map(parseNativeTokenMetadata)];
      if (!data.pagination.nextKey) {
        break;
      }
      params.set("pagination.key", data.pagination.nextKey);
    }
  } catch (error) {
    useToastStore
      .getState()
      .error({ description: "Failed to fetch native tokens" });
    throw error;
  }

  return tokens;
}

function tokensToMap(tokens: CosmToken[]): Map<string, CosmToken> {
  return new Map(tokens.map((t) => [t.id, t]));
}

function getRegistryKey() {
  return `tokenRegistry-${getNode()}.json`;
}

function getCW20RegistryKey() {
  return `tokenCW20Registry-${getNode()}.json`;
}

function getErc20RegistryKey() {
  return `tokenErc20Registry-${getNode()}.json`;
}

function getNode() {
  return useSettingsStore.getState().settings.node;
}

function getNetwork() {
  return NETWORK_NAMES[getNode()];
}

type DenomUnit = {
  denom: string;
  exponent: number;
};
type RegistryToken = {
  description: string;
  denom_units: DenomUnit[];
  base: string;
  display: string;
  name: string;
  symbol: string;
  images: {
    svg?: string;
    png?: string;
  };
  coingecko_id?: string;
  type_asset: "sdk.coin" | "cw20" | "erc20" | "ics20";
  pointer_contract?: { address: `0x${string}`; type_asset: string };
};

type NativeTokenMetadata = {
  description: string;
  denom_units: DenomUnit[];
  base: string;
  display: string;
  name: string;
  symbol: string;
};

function parseRegistryToken(token: RegistryToken): CosmToken {
  return {
    type:
      (token.type_asset === "sdk.coin" ? "native" : token.type_asset) ??
      "native",
    id: token.base,
    decimals: getDecimals(token.denom_units),
    name: token.name,
    symbol: token.symbol,
    logo: token.images.png ?? token.images.svg ?? "",
    coingeckoId: token.coingecko_id ?? "",
    pointerContract: token.pointer_contract?.address,
  };
}

function getDecimals(units: DenomUnit[]): number {
  return units[units.length - 1].exponent;
}

function parseNativeTokenMetadata(token: NativeTokenMetadata): CosmToken {
  const name =
    token.name === token.base ? getNameFromDenom(token.base) : token.name;
  const symbol =
    token.symbol === token.base ? getSymbolFromName(name) : token.symbol;

  return {
    type: "native",
    id: token.base,
    decimals: getDecimals(token.denom_units),
    name,
    symbol,
    logo: "",
    coingeckoId: "",
  };
}

function getNameFromDenom(denom: string) {
  const tokens = denom.split("/");
  return tokens[tokens.length - 1];
}

function getSymbolFromName(name: string) {
  if (name.length <= 6) {
    return name;
  }
  return name.slice(0, 6);
}
