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

export type CW721Tokens = {
  tokens: string[];
};

export type CW721CollectionInfo = {
  name: string;
  symbol: string;
};

export type CW721NumTokens = {
  count: number;
};

export type CW721AllTokenInfo = {
  access: {
    owner: string;
    approvals: unknown[];
  };
  info: {
    token_uri: string;
    extension: {
      image: string | null;
      image_data: string | null;
      external_url: string | null;
      description: string | null;
      name: string | null;
      attributes: Record<string, string> | null;
      background_color: string | null;
      animation_url: string | null;
      youtube_url: string | null;
      royalty_percentage: number;
      royalty_payment_address: string;
    };
  };
};

export type CW721OwnerOf = {
  owner: string;
  approvals: unknown[];
};

export type CW721Minter = {
  minter: string;
};
