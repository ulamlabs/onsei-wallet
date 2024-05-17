import { CosmToken } from "@/services/cosmos";
import { loadFromStorage, saveToStorage } from "@/utils";
import { create } from "zustand";
import { useSettingsStore } from "./settings";
import { NETWORK_NAMES, NODE_URL } from "@/const";

type TokenRegistryStore = {
  tokenRegistry: CosmToken[];
  tokenRegistryMap: Map<string, CosmToken>;
  registryRefreshPromise: Promise<void> | null;
  init: () => Promise<void>;
  refreshRegistryCache: () => Promise<void>;
  _refreshRegistryCache: () => Promise<void>;
};

export const useTokenRegistryStore = create<TokenRegistryStore>((set, get) => ({
  tokenRegistry: [],
  tokenRegistryMap: new Map(),
  registryRefreshPromise: null,
  init: async () => {
    const cachedTokenRegistry = await loadFromStorage<CosmToken[]>(
      getRegistryKey(),
      [],
    );
    set({
      tokenRegistry: cachedTokenRegistry,
      registryRefreshPromise: get()._refreshRegistryCache(),
      tokenRegistryMap: tokensToMap(cachedTokenRegistry),
    });
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
    const tokenRegistry = [...registryTokens, ...uniqueNativeTokens];
    saveToStorage(getRegistryKey(), tokenRegistry);
    set({ tokenRegistry, tokenRegistryMap: tokensToMap(tokenRegistry) });
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

function tokensToMap(tokens: CosmToken[]): Map<string, CosmToken> {
  return new Map(tokens.map((t) => [t.id, t]));
}

function getRegistryKey() {
  return `tokenRegistry-${getNode()}.json`;
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
