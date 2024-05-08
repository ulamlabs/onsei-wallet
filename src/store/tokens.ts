import { NODES } from "@/const";
import { CosmToken } from "@/services/cosmos";
import { Node } from "@/types";
import { loadFromStorage, removeFromStorage, saveToStorage } from "@/utils";
import { create } from "zustand";

const SEI_TOKEN: CosmToken = {
  type: "native",
  address: "",
  decimals: 6,
  name: "Sei",
  symbol: "SEI",
  logo: require("../../assets/sei-logo.png"),
};

type TokensStore = {
  tokens: CosmToken[];
  cw20Tokens: CosmToken[];
  tokenIds: Set<string>;
  address: string;
  node: Node | "";
  loadTokens: (address: string, node: Node) => Promise<void>;
  addToken: (token: CosmToken) => void;
  removeToken: (token: CosmToken) => void;
  clearAddress: (address: string) => Promise<void>;
};

export const useTokensStore = create<TokensStore>((set) => ({
  address: "",
  node: "",
  tokens: [],
  cw20Tokens: [],
  tokenIds: new Set(),
  loadTokens: async (address, node) => {
    set({ address, node, tokens: [SEI_TOKEN] });
    const key = getTokensKey(address, node);
    const cw20Tokens = await loadFromStorage<CosmToken[]>(key, []);
    const tokens = [SEI_TOKEN, ...cw20Tokens];
    set({ tokens, cw20Tokens, tokenIds: tokensToIds(tokens) });
  },
  addToken: (token) => {
    set((state) => {
      const exists = state.tokens.find((t) => t.address === token.address);
      if (exists) {
        return {};
      }
      const cw20Tokens = [...state.cw20Tokens, token];
      const tokens = [SEI_TOKEN, ...cw20Tokens];
      const key = getTokensKey(state.address, state.node);
      saveToStorage(key, cw20Tokens);
      return { tokens, cw20Tokens, tokenIds: tokensToIds(tokens) };
    });
  },
  removeToken: (token) => {
    set((state) => {
      const cw20Tokens = state.cw20Tokens.filter(
        (t) => t.address !== token.address,
      );
      const tokens = [SEI_TOKEN, ...cw20Tokens];
      const key = getTokensKey(state.address, state.node);
      saveToStorage(key, cw20Tokens);
      return { tokens, cw20Tokens, tokenIds: tokensToIds(tokens) };
    });
  },
  clearAddress: async (address) => {
    await Promise.all(
      NODES.map((node) => removeFromStorage(getTokensKey(address, node))),
    );
    set((state) => {
      if (state.address === address) {
        return { address: "", tokenIds: new Set(), tokens: [], cw20Tokens: [] };
      }
      return {};
    });
  },
}));

function getTokensKey(address: string, node: Node | "") {
  return `tokens-${node}-${address}.json`;
}

function tokensToIds(tokens: CosmToken[]): Set<string> {
  return new Set(tokens.map((t) => t.address));
}
