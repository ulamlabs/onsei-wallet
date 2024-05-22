export type coinGeckoCategoryResponse = {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
};

export type geckoTerminalResponse = {
  data: {
    id: string;
    type: "simple_token_price";
    attributes: {
      token_prices: {
        [key: string]: number;
      };
    };
  };
};

export type coinGeckoPrice = {
  [key: string]: { usd: number };
};

export type usdPrices = {
  price: number;
  id: string;
  name?: string;
};
