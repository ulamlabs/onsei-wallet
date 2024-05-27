import { CosmToken, CosmTokenWithPrice } from "@/services/cosmos";
import { loadFromStorage, matchPriceToToken, saveToStorage } from "@/utils";
import { create } from "zustand";
import { useSettingsStore } from "./settings";
import { NETWORK_NAMES, NODE_URL } from "@/const";
import { getUSDPrices, usdPrices } from "@/modules/prices";

type TokenRegistryStore = {
  tokenRegistry: CosmTokenWithPrice[];
  cw20Registry: CosmTokenWithPrice[];
  tokenRegistryMap: Map<string, CosmTokenWithPrice>;
  registryRefreshPromise: Promise<void> | null;
  init: () => Promise<void>;
  addCW20ToRegistry: (newToken: CosmToken) => Promise<void>;
  getPrices: (tokens: CosmToken[]) => Promise<usdPrices[]>;
  refreshRegistryCache: () => Promise<void>;
  _refreshRegistryCache: () => Promise<void>;
};

export const useTokenRegistryStore = create<TokenRegistryStore>((set, get) => ({
  tokenRegistry: [],
  cw20Registry: [],
  tokenRegistryMap: new Map(),
  registryRefreshPromise: null,
  init: async () => {
    const cachedTokenRegistry = await loadFromStorage<CosmTokenWithPrice[]>(
      getRegistryKey(),
      [],
    );
    const cw20Registry = await loadFromStorage<CosmTokenWithPrice[]>(
      getCW20RegistryKey(),
      [],
    );
    set({
      tokenRegistry: cachedTokenRegistry,
      cw20Registry,
      tokenRegistryMap: tokensToMap(cachedTokenRegistry),
    });
    await get()._refreshRegistryCache();
  },
  addCW20ToRegistry: async (newToken) => {
    const { cw20Registry, tokenRegistry, getPrices } = get();
    const exists = cw20Registry.find((t) => t.id === newToken.id);
    if (exists) {
      return;
    }

    const prices = await getPrices([newToken]);
    const newTokenPrice =
      prices.find((p) => matchPriceToToken(newToken, p))?.price || 0;

    const updatedRegistry = [
      ...tokenRegistry,
      { ...newToken, price: newTokenPrice },
    ];
    const updatedCW20Registry = [
      ...cw20Registry,
      { ...newToken, price: newTokenPrice },
    ];
    saveToStorage(getRegistryKey(), updatedRegistry);
    saveToStorage(getCW20RegistryKey(), updatedCW20Registry);
    set({
      tokenRegistry: updatedRegistry,
      cw20Registry: updatedCW20Registry,
      tokenRegistryMap: tokensToMap(updatedRegistry),
    });
  },
  getPrices: async (tokens: CosmToken[]) => {
    try {
      return await getUSDPrices(tokens);
    } catch (e) {
      console.error("error at fetching prices: ", e);
      return [];
    }
  },
  refreshRegistryCache: async () => {
    const { _refreshRegistryCache: _refreshCache } = get();
    set({ registryRefreshPromise: _refreshCache() });
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
    const prices = await get().getPrices(tokenRegistry);

    const tokenRegistryWithPrices = tokenRegistry.map((token) => ({
      ...token,
      price:
        prices.find((price) => matchPriceToToken(token, price))?.price || 0,
    })) as CosmTokenWithPrice[];

    saveToStorage(getRegistryKey(), tokenRegistry);
    set({
      tokenRegistry: tokenRegistryWithPrices,
      tokenRegistryMap: tokensToMap(tokenRegistryWithPrices),
    });
  },
}));

async function fetchRegistry(): Promise<CosmToken[]> {
  const url =
    "https://raw.githubusercontent.com/sei-protocol/chain-registry/main/assetlist.json";
  const response = await fetch(url);
  const data = await response.json();
  return data[getNetwork()].map(parseRegistryToken);
}

async function fetchNativeTokens(): Promise<CosmToken[]> {
  const params = new URLSearchParams({
    "pagination.limit": "1000",
  });
  const url = `https://rest.${NODE_URL[getNode()]}/cosmos/bank/v1beta1/denoms_metadata?${params}`;
  let tokens: CosmToken[] = [];
  while (true) {
    const response = await fetch(url);
    const data = await response.json();
    tokens = [...tokens, ...data.metadatas.map(parseNativeTokenMetadata)];
    if (!data.pagination.nextKey) {
      break;
    }
    params.set("pagination.key", data.pagination.nextKey);
  }

  return tokens;
}

function tokensToMap(
  tokens: CosmTokenWithPrice[],
): Map<string, CosmTokenWithPrice> {
  return new Map(tokens.map((t) => [t.id, t]));
}

function getRegistryKey() {
  return `tokenRegistry-${getNode()}.json`;
}

function getCW20RegistryKey() {
  return `tokenCW20Registry-${getNode()}.json`;
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
