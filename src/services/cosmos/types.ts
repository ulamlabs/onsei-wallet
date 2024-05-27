export type CosmTokenType = "native" | "ics20" | "cw20" | "erc20";

export type CosmToken = {
  type: CosmTokenType;
  id: string; // denom or contract address
  name: string;
  symbol: string;
  decimals: number;
  logo: string;
  coingeckoId: string;
};

export type CosmTokenWithPrice = CosmToken & {
  price: number;
};

export type CosmTokenWithBalance = CosmTokenWithPrice & {
  balance: bigint;
};
