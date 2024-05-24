import { NODES } from "@/const";
import { getUSDPrices, usdPrices } from "@/modules/balances";
import {
  CosmTokenWithBalance,
  fetchAccountBalances,
  fetchCW20TokenBalance,
} from "@/services/cosmos";
import { Node } from "@/types";
import {
  formatAmount,
  formatUsdBalance,
  loadFromStorage,
  matchPriceToToken,
  removeFromStorage,
  saveToStorage,
} from "@/utils";
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
  tokenMap: Map<string, CosmTokenWithBalance>;
  accountAddress: string;
  fetchBalancesPromise: Promise<any> | null;
  prices: usdPrices[];
  loadTokens: (address: string) => Promise<void>;
  addToken: (token: CosmTokenWithBalance) => void;
  removeToken: (token: CosmTokenWithBalance) => void;
  clearAddress: (address: string) => Promise<void>;
  updateBalances: (
    tokens?: CosmTokenWithBalance[],
    updatePrice?: boolean,
  ) => Promise<void[]>;
  _updateCw20Balance: (token: CosmTokenWithBalance) => Promise<void>;
  _updateNativeBalances: () => Promise<void>;
  _updateStructures: (
    tokens: CosmTokenWithBalance[],
    options?: { save?: boolean },
  ) => void;
  loadPrices: (udpate?: boolean) => Promise<void>;
};

export const useTokensStore = create<TokensStore>((set, get) => ({
  accountAddress: "",
  node: "",
  sei: SEI_TOKEN,
  tokens: [],
  cw20Tokens: [],
  tokenMap: new Map(),
  fetchBalancesPromise: null,
  prices: [],
  loadTokens: async (address) => {
    const { updateBalances, _updateStructures, loadPrices } = get();
    const { node } = useSettingsStore.getState().settings;

    set({ accountAddress: address, tokens: [SEI_TOKEN] });
    const key = getTokensKey(address, node);
    let cw20Tokens = await loadFromStorage<CosmTokenWithBalance[]>(key, []);
    cw20Tokens = cw20Tokens.map(deserializeToken);
    _updateStructures([SEI_TOKEN, ...cw20Tokens]);
    await loadPrices();
    updateBalances();
  },
  addToken: async (token) => {
    const {
      tokens,
      _updateStructures,
      _updateCw20Balance: updateBalance,
      loadPrices,
    } = get();
    const exists = tokens.find((t) => t.id === token.id);
    if (exists) {
      return;
    }
    _updateStructures([...tokens, token], { save: true });
    await loadPrices();
    updateBalance(token);
  },
  removeToken: (token) => {
    const { tokens, _updateStructures } = get();
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
  updateBalances: async (tokensToUpdate, updatePrices) => {
    // Will always update native token balances.
    const { cw20Tokens, _updateCw20Balance, loadPrices } = get();
    if (updatePrices) {
      await loadPrices(true);
    }
    let cw20ToUpdate = cw20Tokens;
    if (tokensToUpdate) {
      cw20ToUpdate = tokensToUpdate.filter((t) => t.type === "cw20");
    }

    return Promise.all([
      get()._updateNativeBalances(),
      ...cw20ToUpdate.map((token) => _updateCw20Balance(token)),
    ]);
  },
  _updateCw20Balance: async (token) => {
    const { node } = useSettingsStore.getState().settings;
    const { accountAddress, prices } = get();

    const tokenPrice =
      prices.find((price) => matchPriceToToken(token, price))?.price || 0;

    const balance = await fetchCW20TokenBalance(accountAddress, token.id, node);
    const usdBalance = formatUsdBalance(
      tokenPrice * +formatAmount(balance, token.decimals),
    );

    const { tokenMap, tokens, _updateStructures } = get();

    token = {
      ...tokenMap.get(token.id)!,
      balance,
      usdBalance,
      price: tokenPrice,
    };

    const index = tokens.findIndex((t) => t.id === token.id);
    if (index === -1) {
      return;
    }
    tokens.splice(index, 1, token);

    _updateStructures([...tokens], { save: true });
  },
  _updateNativeBalances: async () => {
    const { accountAddress, cw20Tokens, _updateStructures, sei, prices } =
      get();
    const { node } = useSettingsStore.getState().settings;

    const balances = await fetchAccountBalances(accountAddress, node);

    const { registryRefreshPromise: refreshPromise } =
      useTokenRegistryStore.getState();

    let { tokenRegistryMap } = useTokenRegistryStore.getState();

    const newSei = { ...sei };
    const nativeTokens: CosmTokenWithBalance[] = [newSei];
    for (const balanceData of balances.balances) {
      const balance = BigInt(balanceData.amount);
      if (balanceData.denom === sei.id) {
        const usdPrice =
          prices.find((price) => matchPriceToToken(sei, price))?.price || 0;
        newSei.balance = balance;
        newSei.usdBalance = formatUsdBalance(
          usdPrice *
            +formatAmount(balance, newSei.decimals, {
              noDecimalSeparator: true,
            }),
        );
        newSei.price = usdPrice;
        continue;
      }
      let token = tokenRegistryMap.get(balanceData.denom);
      const usdPrice =
        prices.find((price) => matchPriceToToken(token, price))?.price || 0;

      const usdBalance = token
        ? formatUsdBalance(
            usdPrice *
              +formatAmount(balance, token.decimals, {
                noDecimalSeparator: true,
              }),
          )
        : 0;
      if (!token && refreshPromise) {
        await refreshPromise;
        tokenRegistryMap = useTokenRegistryStore.getState().tokenRegistryMap;
        token = tokenRegistryMap.get(balanceData.denom);
      }
      if (token) {
        nativeTokens.push({ ...token, balance, usdBalance, price: usdPrice });
      }
    }

    _updateStructures([...cw20Tokens, ...nativeTokens]);
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
  loadPrices: async (update) => {
    const { tokens, prices } = get();
    const missingPrices = tokens.filter(
      (token) => !prices.some((price) => matchPriceToToken(token, price)),
    );
    if (missingPrices.length === 0 && !update) {
      return;
    }
    const newPrices = await getUSDPrices(tokens);
    set({ prices: newPrices });
  },
}));

function getTokensKey(address: string, node: Node | "") {
  return `cw20tokens-${node}-${address}.json`;
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
