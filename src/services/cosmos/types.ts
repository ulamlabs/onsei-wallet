export const CosmTokens = [
  "native",
  "ics20",
  "cw20",
  "erc20",
  "cw721",
  "erc721",
] as const;

export const nativeTokens = ["native", "ics20"] as const;
export const cwTokens = ["cw20", "cw721"] as const;
export const ercTokens = ["erc20", "erc721"] as const;
export const nftTokens = ["erc721", "cw721"] as const;
export const nonNativeTokens = [...cwTokens, ...ercTokens] as const;

export type CosmTokenType = (typeof CosmTokens)[number];
export type NativeTokenType = (typeof nativeTokens)[number];
export type CwTokenType = (typeof cwTokens)[number];
export type ErcTokenType = (typeof ercTokens)[number];
export type NftTokenType = (typeof nftTokens)[number];
export type NonNativeTokenType = (typeof nonNativeTokens)[number];

export type CosmToken = {
  type: CosmTokenType;
  id: string; // denom or contract address
  name: string;
  symbol: string;
  decimals: number;
  logo: string;
  coingeckoId: string;
  pointerContract?: `0x${string}`;
};

export type CosmTokenWithPrice = CosmToken & {
  price: number;
};

export type CosmTokenWithBalance = CosmTokenWithPrice & {
  balance: bigint;
};
