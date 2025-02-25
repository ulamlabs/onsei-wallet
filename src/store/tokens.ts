import { NODES } from "@/const";
import { TokenBalance } from "@/modules/transactions";
import {
  CosmToken,
  CosmTokenWithBalance,
  CosmTokenWithPrice,
  fetchAccountBalances,
  fetchCW20TokenBalance,
} from "@/services/cosmos";
import { fetchERC20TokenBalance, getPointerContract } from "@/services/evm";
import { Node } from "@/types";
import { loadFromStorage, removeFromStorage, saveToStorage } from "@/utils";
import { isAddress as IsEvmAddress } from "viem";
import { create } from "zustand";
import { useSettingsStore } from "./settings";
import { useToastStore } from "./toast";
import { useTokenRegistryStore } from "./tokenRegistry";

const SEI_TOKEN: CosmTokenWithBalance = {
  type: "native",
  id: "usei",
  decimals: 6,
  name: "Sei",
  symbol: "SEI",
  logo: require("../../assets/sei-logo.png"),
  balance: 0n,
  coingeckoId: "usei",
  price: 0,
};

type TokensStore = {
  sei: CosmTokenWithBalance;
  tokens: CosmTokenWithBalance[];
  nonNativeTokens: CosmTokenWithBalance[];
  whitelistedTokensIds: Set<string>;
  blacklistedTokensIds: Set<string>;
  tokenMap: Map<string, CosmTokenWithBalance>;
  accountAddress: string;
  accountAddressEvm: `0x${string}`;
  initTokensLoading: boolean;
  loadTokens: (address: string, evmAddress?: `0x${string}`) => Promise<void>;
  addTokens: (tokensToAdd: CosmToken[]) => Promise<void>;
  removeTokens: (tokensToRemove: CosmToken[]) => void;
  clearAddress: (address: string) => Promise<void>;
  getTokensFromRegistry: (tokenIds: string[]) => Promise<CosmTokenWithPrice[]>;
  updateBalances: (tokens?: CosmTokenWithBalance[]) => Promise<void>;
  _updateNonNativeBalance: (token: CosmToken) => Promise<void>;
  _updateNativeBalances: () => Promise<void>;
  _updateTokenLists: (
    tokenIds: string[],
    action: "WHITELIST" | "BLACKLIST",
  ) => Promise<void>;
  _updateStructures: (
    tokens: CosmTokenWithBalance[],
    options?: { save?: boolean },
  ) => void;
};

export const useTokensStore = create<TokensStore>((set, get) => ({
  accountAddress: "",
  accountAddressEvm: "0x",
  node: "",
  sei: SEI_TOKEN,
  tokens: [],
  nonNativeTokens: [],
  whitelistedTokensIds: new Set(),
  blacklistedTokensIds: new Set(),
  tokenMap: new Map(),
  initTokensLoading: true,
  loadTokens: async (address, evmAddress) => {
    const { updateBalances, _updateStructures } = get();
    const { node } = useSettingsStore.getState().settings;
    const whitelistKey = getTokenWhitelistKey(address, node);
    const blacklistKey = getTokenBlacklistKey(address, node);
    const [whitelistedTokensIds, blacklistedTokensIds] = await Promise.all([
      loadFromStorage<string[]>(whitelistKey, ["usei"]),
      loadFromStorage<string[]>(blacklistKey, []),
    ]);

    set({
      accountAddress: address,
      accountAddressEvm: evmAddress || "0x",
      tokens: [SEI_TOKEN],
      whitelistedTokensIds: new Set(whitelistedTokensIds),
      blacklistedTokensIds: new Set(blacklistedTokensIds),
    });
    const nonNativeKey = getNonNativeKey(address, node);
    let nonNativeTokens = await loadFromStorage<CosmTokenWithBalance[]>(
      nonNativeKey,
      [],
    );

    // CW20 tokens were stored in a different key before, used for backwards compatibility
    const oldKey = getOldKey(address, node);
    let cw20Tokens = await loadFromStorage<CosmTokenWithBalance[]>(oldKey, []);
    cw20Tokens = cw20Tokens.map(deserializeToken);
    nonNativeTokens = nonNativeTokens.map(deserializeToken);
    const tokenMap = new Map(); // Removes duplicates
    tokenMap.set(SEI_TOKEN.id, SEI_TOKEN);

    nonNativeTokens.forEach((token) => {
      tokenMap.set(token.id, token);
    });

    cw20Tokens.forEach((token) => {
      tokenMap.set(token.id, token);
    });
    _updateStructures([...tokenMap.values()]);
    await updateBalances();
  },
  addTokens: async (tokensToAdd) => {
    const {
      tokens,
      _updateNativeBalances: updateNativeBalances,
      _updateTokenLists: updateTokenLists,
      _updateNonNativeBalance: updateNonNativeBalance,
    } = get();
    const nativeIds = getNativeIds(tokensToAdd);

    if (nativeIds.length > 0) {
      await updateTokenLists(nativeIds, "WHITELIST");
    }

    const knownIds = new Set(tokens.map((t) => t.id));

    const nonNativeToAdd = tokensToAdd.filter(
      (t) => !knownIds.has(t.id) && (t.type === "erc20" || t.type === "cw20"),
    );
    const nativesToAdd = tokensToAdd.filter(
      (t) => !knownIds.has(t.id) && t.type !== "cw20" && t.type !== "erc20",
    );

    for (const token of nonNativeToAdd) {
      const pointerContract = IsEvmAddress(token.id)
        ? undefined
        : await getPointerContract(token.id);
      const parsedToken = {
        ...token,
        id: token.id.toLowerCase(),
        pointerContract,
      };

      await useTokenRegistryStore
        .getState()
        .addNonNativeToRegistry(parsedToken);
      await updateNonNativeBalance(parsedToken);
    }

    if (nativesToAdd.length > 0) {
      await updateNativeBalances();
    }
  },
  removeTokens: (tokensToRemove) => {
    const { tokens, _updateTokenLists, _updateStructures } = get();
    const nativeIds = getNativeIds(tokensToRemove);
    if (nativeIds.length > 0) {
      _updateTokenLists(nativeIds, "BLACKLIST");
    }

    const removedIds = new Set(tokensToRemove.map((t) => t.id));
    const nextTokens = tokens.filter((t) => !removedIds.has(t.id));
    _updateStructures(nextTokens, { save: true });
  },
  clearAddress: async (address) => {
    await Promise.all(
      NODES.map((node) => {
        removeFromStorage(getNonNativeKey(address, node));
        removeFromStorage(getOldKey(address, node));
      }),
    );
    set((state) => {
      if (state.accountAddress === address) {
        return {
          accountAddress: "",
          tokenMap: new Map(),
          tokens: [],
          nonNativeTokens: [],
        };
      }
      return {};
    });
  },
  getTokensFromRegistry: async (tokenIds) => {
    const { getTokensWithPrices } = useTokenRegistryStore.getState();
    return await getTokensWithPrices(tokenIds);
  },
  updateBalances: async (tokensToUpdate) => {
    // Will always update native token balances.
    const { nonNativeTokens, _updateNonNativeBalance } = get();
    let nonNativeToUpdate: CosmTokenWithBalance[] = nonNativeTokens;
    if (tokensToUpdate) {
      nonNativeToUpdate = tokensToUpdate.filter(
        (t) => t.type === "cw20" || t.type === "erc20",
      );
    }

    await get()._updateNativeBalances();
    await Promise.all([
      ...nonNativeToUpdate.map((token) => _updateNonNativeBalance(token)),
    ]);

    set({ initTokensLoading: false });
  },
  _updateNonNativeBalance: async (token) => {
    const {
      accountAddress,
      getTokensFromRegistry,
      tokens,
      _updateStructures,
      accountAddressEvm,
    } = get();
    const { node } = useSettingsStore.getState().settings;
    const { error: errorToast } = useToastStore.getState();
    try {
      let tokenResponse: CosmTokenWithPrice | undefined;
      let balance: bigint | undefined;
      if (token.type === "cw20") {
        const [tokenFromRegistry, fetchedBalance] = await Promise.all([
          getTokensFromRegistry([token.id]),
          fetchCW20TokenBalance(accountAddress, token.id, node),
        ]);
        tokenResponse = tokenFromRegistry[0];
        balance = fetchedBalance;
      }

      if (token.type === "erc20") {
        const [tokenFromRegistry, fetchedBalance] = await Promise.all([
          getTokensFromRegistry([token.id]),
          fetchERC20TokenBalance(node, token, accountAddressEvm),
        ]);
        tokenResponse = tokenFromRegistry[0];
        balance = fetchedBalance;
      }

      if (!tokenResponse) {
        return;
      }
      const tokenWithBalance = {
        ...tokenResponse,
        balance: balance || 0n,
      };
      const index = tokens.findIndex((t) => t.id === tokenWithBalance.id);
      if (index === -1) {
        tokens.push(tokenWithBalance);
      } else {
        tokens.splice(index, 1, tokenWithBalance);
      }
      _updateStructures([...tokens], { save: true });
    } catch (error) {
      console.error("error at updating non native token balance: ", error);
      errorToast({ description: "Error at updating non native token balance" });
    }
  },
  _updateNativeBalances: async () => {
    const {
      accountAddress,
      nonNativeTokens,
      _updateStructures,
      sei,
      getTokensFromRegistry,
      whitelistedTokensIds,
      blacklistedTokensIds,
    } = get();
    const { error: errorToast } = useToastStore.getState();
    const definedSei = sei || SEI_TOKEN;

    try {
      const { node } = useSettingsStore.getState().settings;

      const balances = await fetchAccountBalances(accountAddress, node);
      if (!balances) {
        return;
      }

      balances.balances = balances.balances.filter(
        (token: TokenBalance) => !blacklistedTokensIds.has(token.denom),
      );

      for (const whitelistedID of whitelistedTokensIds) {
        if (
          !balances.balances.find(
            (token: TokenBalance) => token.denom === whitelistedID,
          ) &&
          !nonNativeTokens.some((token) => token.id === whitelistedID)
        ) {
          balances.balances.push({ denom: whitelistedID, amount: "0" });
        }
      }

      const tokensWithPrices = await getTokensFromRegistry(
        balances.balances.map((b: TokenBalance) => b.denom),
      );

      const nativeTokens: CosmTokenWithBalance[] = [];
      for (const balanceData of balances.balances) {
        const balance = BigInt(balanceData.amount);
        const token = tokensWithPrices.find((t) => t.id === balanceData.denom);

        if (token) {
          if (balanceData.denom === definedSei.id) {
            token.logo = definedSei.logo;
          }
          nativeTokens.push({ ...token, balance } as CosmTokenWithBalance);
        }
      }

      _updateStructures([...nonNativeTokens, ...nativeTokens]);
    } catch (error: any) {
      console.error("error at updating native balances: ", error);
      errorToast({ description: "Error at updating native balances" });
    }
  },
  _updateTokenLists: async (tokenIds, action) => {
    const {
      accountAddress: address,
      whitelistedTokensIds,
      blacklistedTokensIds,
    } = get();
    const { node } = useSettingsStore.getState().settings;
    const whitelistKey = getTokenWhitelistKey(address, node);
    const blacklistKey = getTokenBlacklistKey(address, node);

    const newWhitelist = whitelistedTokensIds;
    const newBlacklist = blacklistedTokensIds;
    for (const tokenId of tokenIds) {
      if (action === "WHITELIST") {
        newWhitelist.add(tokenId);
        newBlacklist.delete(tokenId);
      } else {
        newWhitelist.delete(tokenId);
        newBlacklist.add(tokenId);
      }
    }
    set({
      whitelistedTokensIds: newWhitelist,
      blacklistedTokensIds: newBlacklist,
    });
    await Promise.all([
      saveToStorage(whitelistKey, [...newWhitelist]),
      saveToStorage(blacklistKey, [...newBlacklist]),
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
    const nonNativeTokens = tokens.filter(
      (t) => t.type === "cw20" || t.type === "erc20",
    );
    const sei = tokens.find((t) => t.type === "native");
    const tokenMap = tokensToMap(tokens);
    set({ sei, tokens, nonNativeTokens, tokenMap });
    if (options?.save) {
      const key = getNonNativeKey(accountAddress, node);
      saveToStorage(key, nonNativeTokens.map(serializeToken));
    }
  },
}));

function getTokenWhitelistKey(address: string, node: Node | "") {
  return `token-whitelist-${node}-${address}.json`;
}

function getTokenBlacklistKey(address: string, node: Node | "") {
  return `token-blacklist-${node}-${address}.json`;
}

function getNonNativeKey(address: string, node: Node | "") {
  return `non-native-tokens-${node}-${address}.json`;
}

// Using old key for backwards compatibility
function getOldKey(address: string, node: Node | "") {
  return `cw20Tokens-${node}-${address}.json`;
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

function getNativeIds(tokens: CosmToken[]) {
  return tokens
    .filter((t) => t.type !== "cw20" && t.type !== "erc20")
    .map((t) => t.id);
}
