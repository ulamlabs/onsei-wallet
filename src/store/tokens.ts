import { NODES } from "@/const";
import {
  CosmToken,
  CosmTokenWithBalance,
  CosmTokenWithPrice,
  fetchAccountBalances,
  fetchCW20TokenBalance,
} from "@/services/cosmos";
import { Node } from "@/types";
import { loadFromStorage, removeFromStorage, saveToStorage } from "@/utils";
import { create } from "zustand";
import { useSettingsStore } from "./settings";
import { useTokenRegistryStore } from "./tokenRegistry";

const SEI_TOKEN: CosmTokenWithBalance = {
  type: "native",
  id: "usei",
  decimals: 6,
  name: "Sei",
  symbol: "SEI",
  logo: require("../../assets/sei-logo.png"),
  balance: 0n,
  coingeckoId: "sei-network",
  price: 0,
};

type TokensStore = {
  sei: CosmTokenWithBalance;
  tokens: CosmTokenWithBalance[];
  cw20Tokens: CosmTokenWithBalance[];
  whitelistedTokensIds: string[];
  blacklistedTokensIds: string[];
  tokenMap: Map<string, CosmTokenWithBalance>;
  accountAddress: string;
  fetchBalancesPromise: Promise<any> | null;
  loadTokens: (address: string) => Promise<void>;
  addToken: (token: CosmToken) => Promise<void>;
  removeToken: (token: CosmToken) => void;
  clearAddress: (address: string) => Promise<void>;
  getTokenFromRegistry: (
    tokenId: string,
  ) => Promise<CosmTokenWithPrice | undefined>;
  updateBalances: (tokens?: CosmTokenWithBalance[]) => Promise<void[]>;
  _updateCw20Balance: (tokenId: string) => Promise<void>;
  _updateNativeBalances: () => Promise<void>;
  _updateTokenLists: (
    tokenId: string,
    action: "WHITELIST" | "BLACKLIST",
  ) => Promise<void>;
  _updateStructures: (
    tokens: CosmTokenWithBalance[],
    options?: { save?: boolean },
  ) => void;
};

export const useTokensStore = create<TokensStore>((set, get) => ({
  accountAddress: "",
  node: "",
  sei: SEI_TOKEN,
  tokens: [],
  cw20Tokens: [],
  whitelistedTokensIds: [],
  blacklistedTokensIds: [],
  tokenMap: new Map(),
  fetchBalancesPromise: null,
  loadTokens: async (address) => {
    const { updateBalances, _updateStructures } = get();
    const { node } = useSettingsStore.getState().settings;
    const whitelistKey = getTokenWhitelistKey(address, node);
    const blacklistKey = getTokenBlacklistKey(address, node);
    const [whitelistedTokensIds, blacklistedTokensIds] = await Promise.all([
      loadFromStorage<string[]>(whitelistKey, []),
      loadFromStorage<string[]>(blacklistKey, []),
    ]);

    set({
      accountAddress: address,
      tokens: [SEI_TOKEN],
      whitelistedTokensIds,
      blacklistedTokensIds,
    });
    const key = getTokensKey(address, node);
    let cw20Tokens = await loadFromStorage<CosmTokenWithBalance[]>(key, []);
    cw20Tokens = cw20Tokens.map(deserializeToken);
    _updateStructures([SEI_TOKEN, ...cw20Tokens]);
    await updateBalances();
  },
  addToken: async (token) => {
    const {
      tokens,
      _updateNativeBalances: updateNativeBalances,
      _updateTokenLists: updateTokenLists,
      _updateCw20Balance: updateCW20Balance,
    } = get();
    if (token.type !== "cw20") {
      await updateTokenLists(token.id, "WHITELIST");
    }
    const exists = tokens.find((t) => t.id === token.id);
    if (exists) {
      return;
    }

    if (token.type === "cw20") {
      await useTokenRegistryStore.getState().addCW20ToRegistry(token);
      await updateCW20Balance(token.id);
    } else {
      await updateNativeBalances();
    }
  },
  removeToken: (token) => {
    const { tokens, _updateTokenLists, _updateStructures } = get();
    if (token.type !== "cw20") {
      _updateTokenLists(token.id, "BLACKLIST");
    }
    const nextTokens = tokens.filter((t) => t.id !== token.id);
    _updateStructures(nextTokens, { save: true });
  },
  clearAddress: async (address) => {
    await Promise.all(
      NODES.map((node) => removeFromStorage(getTokensKey(address, node))),
    );
    set((state) => {
      if (state.accountAddress === address) {
        return {
          accountAddress: "",
          tokenMap: new Map(),
          tokens: [],
          cw20Tokens: [],
        };
      }
      return {};
    });
  },
  getTokenFromRegistry: async (tokenId) => {
    // eslint-disable-next-line prefer-const
    let { tokenRegistryMap, registryRefreshPromise } =
      useTokenRegistryStore.getState();

    let token = tokenRegistryMap.get(tokenId);
    if (!token || registryRefreshPromise) {
      await registryRefreshPromise;
      tokenRegistryMap = useTokenRegistryStore.getState().tokenRegistryMap;
      token = tokenRegistryMap.get(tokenId);
    }
    return token;
  },
  updateBalances: async (tokensToUpdate) => {
    // Will always update native token balances.
    const { cw20Tokens, _updateCw20Balance } = get();
    let cw20ToUpdate: CosmTokenWithBalance[] = cw20Tokens;
    if (tokensToUpdate) {
      cw20ToUpdate = tokensToUpdate.filter((t) => t.type === "cw20");
    }

    await get()._updateNativeBalances();
    return Promise.all([
      ...cw20ToUpdate.map((token) => _updateCw20Balance(token.id)),
    ]);
  },
  _updateCw20Balance: async (tokenId) => {
    const { node } = useSettingsStore.getState().settings;
    const { accountAddress, tokens, getTokenFromRegistry, _updateStructures } =
      get();

    const [token, balance] = await Promise.all([
      getTokenFromRegistry(tokenId),
      fetchCW20TokenBalance(accountAddress, tokenId, node),
    ]);
    if (!token) {
      return;
    }

    const tokenWithBalance = {
      ...token,
      balance,
    };

    const index = tokens.findIndex((t) => t.id === tokenWithBalance.id);
    if (index === -1) {
      tokens.push(tokenWithBalance);
    } else {
      tokens.splice(index, 1, tokenWithBalance);
    }

    _updateStructures([...tokens], { save: true });
  },
  _updateNativeBalances: async () => {
    const {
      accountAddress,
      cw20Tokens,
      _updateStructures,
      sei,
      getTokenFromRegistry,
      whitelistedTokensIds,
      blacklistedTokensIds,
    } = get();
    const { node } = useSettingsStore.getState().settings;

    const balances = await fetchAccountBalances(accountAddress, node);

    balances.balances = balances.balances.filter(
      (token) => !blacklistedTokensIds.includes(token.denom),
    );
    for (const whitelistedID of whitelistedTokensIds) {
      if (!balances.balances.find((token) => token.denom === whitelistedID)) {
        balances.balances.push({ denom: whitelistedID, amount: "0" });
      }
    }

    const nativeTokens: CosmTokenWithBalance[] = [];
    for (const balanceData of balances.balances) {
      const balance = BigInt(balanceData.amount);
      const token = await getTokenFromRegistry(balanceData.denom);

      if (token) {
        if (balanceData.denom === sei.id) {
          token.logo = sei.logo;
        }
        nativeTokens.push({ ...token, balance } as CosmTokenWithBalance);
      }
    }

    _updateStructures([...cw20Tokens, ...nativeTokens]);
  },
  _updateTokenLists: async (tokenId, action) => {
    const {
      accountAddress: address,
      whitelistedTokensIds,
      blacklistedTokensIds,
    } = get();
    const { node } = useSettingsStore.getState().settings;
    const whitelistKey = getTokenWhitelistKey(address, node);
    const blacklistKey = getTokenBlacklistKey(address, node);

    let newWhitelist, newBlacklist;
    if (action === "WHITELIST") {
      newWhitelist = [...whitelistedTokensIds, tokenId];
      newBlacklist = blacklistedTokensIds.filter((t) => t !== tokenId);
    } else {
      newWhitelist = whitelistedTokensIds.filter((t) => t !== tokenId);
      newBlacklist = [...blacklistedTokensIds, tokenId];
    }

    set({
      whitelistedTokensIds: newWhitelist,
      blacklistedTokensIds: newBlacklist,
    });
    await Promise.all([
      saveToStorage(whitelistKey, newWhitelist),
      saveToStorage(blacklistKey, newBlacklist),
    ]);
  },
  _updateStructures: (tokens, options) => {
    const { accountAddress } = get();
    const { node } = useSettingsStore.getState().settings;

    tokens = tokens.sort((a, b) => {
      if (a.id === "usei") {
        return -Infinity;
      }
      if (b.id === "usei") {
        return Infinity;
      }
      return a.symbol.localeCompare(b.symbol);
    });

    const cw20Tokens = tokens.filter((t) => t.type === "cw20");
    const sei = tokens.find((t) => t.type === "native");
    const tokenMap = tokensToMap(tokens);

    set({ sei, tokens, cw20Tokens, tokenMap });

    if (options?.save) {
      const key = getTokensKey(accountAddress, node);
      saveToStorage(key, cw20Tokens.map(serializeToken));
    }
  },
}));

function getTokensKey(address: string, node: Node | "") {
  return `cw20tokens-${node}-${address}.json`;
}

function getTokenWhitelistKey(address: string, node: Node | "") {
  return `token-whitelist-${node}-${address}.json`;
}

function getTokenBlacklistKey(address: string, node: Node | "") {
  return `token-blacklist-${node}-${address}.json`;
}

function tokensToMap(
  tokens: CosmTokenWithBalance[],
): Map<string, CosmTokenWithBalance> {
  return new Map(tokens.map((t) => [t.id, t]));
}

function serializeToken(token: CosmTokenWithBalance): CosmTokenWithBalance {
  return { ...token, balance: token.balance.toString() as any };
}

function deserializeToken(token: CosmTokenWithBalance): CosmTokenWithBalance {
  return { ...token, balance: BigInt(token.balance) };
}
