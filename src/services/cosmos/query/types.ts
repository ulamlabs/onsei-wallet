export type CW20TokenInfo = {
  decimals: number;
  name: string;
  symbol: string;
  total_supply: string;
};

export type CW20MarketingInfo = {
  description: string;
  logo?: {
    url: string;
  };
  marketing: string;
  project: string;
};

export type CW20BalanceInfo = {
  balance: string;
};
