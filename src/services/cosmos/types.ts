export type CosmTokenType = "native" | "ics20" | "cw20";

export type CosmToken = {
  type: CosmTokenType;
  id: string; // denom or contract address
  name: string;
  symbol: string;
  decimals: number;
  logo: string;
  balance: bigint;
};
