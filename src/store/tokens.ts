import { NODES } from "@/const";
import {
  CosmToken,
  fetchAccountBalances,
  fetchCW20TokenBalance,
} from "@/services/cosmos";
import { Node } from "@/types";
import { loadFromStorage, removeFromStorage, saveToStorage } from "@/utils";
import { create } from "zustand";
import { useSettingsStore } from "./settings";

const SEI_TOKEN: CosmToken = {
  type: "native",
  id: "usei",
  decimals: 6,
  name: "Sei",
  symbol: "SEI",
  logo: require("../../assets/sei-logo.png"),
  balance: 0n,
};

type TokensStore = {
  sei: CosmToken;
  tokens: CosmToken[];
  cw20Tokens: CosmToken[];
  tokenMap: Map<string, CosmToken>;
  accountAddress: string;
  loadTokens: (address: string) => Promise<void>;
  addToken: (token: CosmToken) => void;
  removeToken: (token: CosmToken) => void;
  clearAddress: (address: string) => Promise<void>;
  updateBalance: (token: CosmToken) => Promise<void>;
  updateBalances: (tokens?: CosmToken[]) => Promise<void[]>;
  _updateStructures: (
    tokens: CosmToken[],
    options?: { save?: boolean },
  ) => void;
};

export const useTokensStore = create<TokensStore>((set, get) => ({
  accountAddress: "",
  node: "",
  sei: SEI_TOKEN,
  tokens: [],
  cw20Tokens: [],
  tokenMap: new Map(),
  loadTokens: async (address) => {
    const { updateBalances, _updateStructures } = get();
    const { node } = useSettingsStore.getState().settings;
    set({ accountAddress: address, tokens: [SEI_TOKEN] });
    const key = getTokensKey(address, node);
    let cw20Tokens = await loadFromStorage<CosmToken[]>(key, []);
    cw20Tokens = cw20Tokens.map(deserializeToken);
    _updateStructures([SEI_TOKEN, ...cw20Tokens]);
    updateBalances();
  },
  addToken: (token) => {
    const { tokens, _updateStructures, updateBalance } = get();
    const exists = tokens.find((t) => t.id === token.id);
    if (exists) {
      return;
    }
    _updateStructures([...tokens, token], { save: true });
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
  updateBalance: async (token) => {
    const { accountAddress, tokens, _updateStructures } = get();
    const { node } = useSettingsStore.getState().settings;

    token = { ...token };
    const index = tokens.findIndex((t) => t.id === token.id);
    if (index === -1) {
      return;
    }
    tokens.splice(index, 1, token);

    if (token.type === "native") {
      const balances = await fetchAccountBalances(accountAddress, node);
      token.balance = BigInt(
        balances.balances.find((b) => b.denom === "usei")?.amount ?? "0",
      );
    } else if (token.type === "cw20") {
      token.balance = await fetchCW20TokenBalance(
        accountAddress,
        token.id,
        node,
      );
    }
    _updateStructures([...tokens], { save: true });
  },
  updateBalances: (tokensToUpdate) => {
    const { tokens, updateBalance } = get();
    if (!tokensToUpdate) {
      tokensToUpdate = tokens;
    }
    return Promise.all(tokensToUpdate.map((token) => updateBalance(token)));
  },
  _updateStructures: (tokens, options) => {
    const { accountAddress } = get();
    const { node } = useSettingsStore.getState().settings;
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

function tokensToMap(tokens: CosmToken[]): Map<string, CosmToken> {
  return new Map(tokens.map((t) => [t.id, t]));
}

function serializeToken(token: CosmToken): CosmToken {
  return { ...token, balance: token.balance.toString() as any };
}

function deserializeToken(token: CosmToken): CosmToken {
  return { ...token, balance: BigInt(token.balance) };
}
