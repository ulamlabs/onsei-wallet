export type CosmTokenType = "native" | "ics20" | "cw20";

export type CosmToken = {
  type: CosmTokenType;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logo: string;
};

export type CW20TokenInfo = {
  decimals: number;
  name: string;
  symbol: string;
  total_supply: string;
};

export type CW20MarketingInfo = {
  description: string;
  logo: {
    url: string;
  };
  marketing: string;
  project: string;
};
