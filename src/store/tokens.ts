import { NODES } from "@/const";
import { TokenBalance } from "@/modules/transactions";
import {
  CosmToken,
  CosmTokenWithBalance,
  CosmTokenWithPrice,
  fetchAccountBalances,
  fetchCW20TokenBalance,
} from "@/services/cosmos";
import { getPointerContract } from "@/services/evm";
import { EVM_RPC_MAIN, EVM_RPC_TEST, erc20Abi } from "@/services/evm/consts";
import { Node } from "@/types";
import { loadFromStorage, removeFromStorage, saveToStorage } from "@/utils";
import { ethers } from "ethers";
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
  cw20Tokens: CosmTokenWithBalance[];
  erc20Tokens: CosmTokenWithBalance[];
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
  _updateCw20Balance: (tokenId: string) => Promise<void>;
  _updateErc20Balances: (token: CosmTokenWithBalance) => Promise<void>;
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
  cw20Tokens: [],
  erc20Tokens: [],
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
    const key = getTokensKey(address, node);
    const erc20Key = getErc20TokensKey(address, node);
    let cw20Tokens = await loadFromStorage<CosmTokenWithBalance[]>(key, []);
    cw20Tokens = cw20Tokens.map(deserializeToken);
    let erc20Tokens = await loadFromStorage<CosmTokenWithBalance[]>(
      erc20Key,
      [],
    );
    erc20Tokens = erc20Tokens.map(deserializeToken);
    _updateStructures([SEI_TOKEN, ...cw20Tokens, ...erc20Tokens]);
    await updateBalances();
  },
  addTokens: async (tokensToAdd) => {
    const {
      tokens,
      _updateNativeBalances: updateNativeBalances,
      _updateTokenLists: updateTokenLists,
      _updateCw20Balance: updateCW20Balance,
      _updateErc20Balances: updateErc20Balances,
    } = get();
    const nativeIds = getNativeIds(tokensToAdd);
    if (nativeIds.length > 0) {
      await updateTokenLists(nativeIds, "WHITELIST");
    }

    const knownIds = new Set(tokens.map((t) => t.id));
    const cwToAdd = tokensToAdd.filter(
      (t) => !knownIds.has(t.id) && t.type === "cw20",
    );
    const nativesToAdd = tokensToAdd.filter(
      (t) => !knownIds.has(t.id) && t.type !== "cw20",
    );
    const erc20ToAdd = tokensToAdd.filter(
      (t) => !knownIds.has(t.id) && t.type === "erc20",
    );
    for (const erc20 of erc20ToAdd) {
      await useTokenRegistryStore.getState().addCW20ToRegistry(erc20);
      await updateErc20Balances({ ...erc20, price: 0, balance: 0n });
    }
    for (const cw of cwToAdd) {
      await useTokenRegistryStore.getState().addCW20ToRegistry(cw);
      await updateCW20Balance(cw.id);
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
  getTokensFromRegistry: async (tokenIds) => {
    const { getTokensWithPrices } = useTokenRegistryStore.getState();
    return await getTokensWithPrices(tokenIds);
  },
  updateBalances: async (tokensToUpdate) => {
    // Will always update native token balances.
    const {
      cw20Tokens,
      _updateCw20Balance,
      erc20Tokens,
      _updateErc20Balances,
    } = get();
    let cw20ToUpdate: CosmTokenWithBalance[] = cw20Tokens;
    let erc20ToUpdate: CosmTokenWithBalance[] = erc20Tokens;
    if (tokensToUpdate) {
      cw20ToUpdate = tokensToUpdate.filter((t) => t.type === "cw20");
      erc20ToUpdate = tokensToUpdate.filter((t) => t.type === "erc20");
    }

    await get()._updateNativeBalances();
    await Promise.all([
      ...cw20ToUpdate.map((token) => _updateCw20Balance(token.id)),
      ...erc20ToUpdate.map((token) => _updateErc20Balances(token)),
    ]);

    set({ initTokensLoading: false });
  },
  _updateCw20Balance: async (tokenId) => {
    const { node } = useSettingsStore.getState().settings;
    const { accountAddress, tokens, getTokensFromRegistry, _updateStructures } =
      get();
    const { error: errorToast } = useToastStore.getState();
    try {
      const [token, balance] = await Promise.all([
        getTokensFromRegistry([tokenId]),
        fetchCW20TokenBalance(accountAddress, tokenId, node),
      ]);
      if (!token[0]) {
        return;
      }

      const tokenWithBalance = {
        ...token[0],
        balance,
      };

      const index = tokens.findIndex((t) => t.id === tokenWithBalance.id);
      if (index === -1) {
        tokens.push(tokenWithBalance);
      } else {
        tokens.splice(index, 1, tokenWithBalance);
      }

      _updateStructures([...tokens], { save: true });
    } catch (error: any) {
      console.error("error at updating cw20 balance: ", error);
      errorToast({ description: "Error at updating CW20 balance" });
    }
  },
  _updateNativeBalances: async () => {
    const {
      accountAddress,
      cw20Tokens,
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
          )
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

      _updateStructures([...cw20Tokens, ...nativeTokens]);
    } catch (error: any) {
      console.error("error at updating native balances: ", error);
      errorToast({ description: "Error at updating native balances" });
    }
  },
  _updateErc20Balances: async (token) => {
    const { accountAddressEvm, tokens, _updateStructures } = get();
    const { error: errorToast } = useToastStore.getState();

    try {
      const pointerContract =
        token.pointerContract ||
        (token.id.startsWith("0x")
          ? (token.id as `0x${string}`)
          : await getPointerContract(token.id));

      if (!pointerContract) {
        throw new Error("Failed updating ERC20 balances.");
      }

      const contract = prepareRawContract(pointerContract);
      const balance = await contract.balanceOf(accountAddressEvm);

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
    } catch (error: any) {
      console.error("error at updating erc20 balance: ", error);
      errorToast({ description: "Error at updating ERC20 balance" });
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

    const cw20Tokens = tokens.filter((t) => t.type === "cw20");
    const sei = tokens.find((t) => t.type === "native");
    const tokenMap = tokensToMap(tokens);
    const erc20Tokens = tokens.filter((t) => t.type === "erc20");

    set({ sei, tokens, cw20Tokens, tokenMap, erc20Tokens });

    if (options?.save) {
      const key = getTokensKey(accountAddress, node);
      saveToStorage(key, cw20Tokens.map(serializeToken));
      const erc20Key = getErc20TokensKey(accountAddress, node);
      saveToStorage(erc20Key, erc20Tokens.map(serializeToken));
    }
  },
}));

function getTokensKey(address: string, node: Node | "") {
  return `cw20tokens-${node}-${address}.json`;
}

function getErc20TokensKey(address: string, node: Node | "") {
  return `erc20tokens-${node}-${address}.json`;
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

function getNativeIds(tokens: CosmToken[]) {
  return tokens.filter((t) => t.type !== "cw20").map((t) => t.id);
}

export function prepareRawContract(pointerContract: `0x${string}`) {
  const isMainnet = useSettingsStore.getState().settings.node === "MainNet";
  const evmRpcEndpoint = isMainnet ? EVM_RPC_MAIN : EVM_RPC_TEST;
  const provider = new ethers.JsonRpcProvider(evmRpcEndpoint);
  const contract = new ethers.Contract(pointerContract, erc20Abi, provider);
  return contract;
}
