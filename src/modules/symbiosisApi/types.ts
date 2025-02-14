export type SymbiosisToken = {
  address: string;
  chainId: number;
  chainIdFrom?: number;
  decimals: number;
  symbol: string;
  icon: string;
};

export type SymbiosisChain = {
  id: number;
  name: string;
  explorer: string;
  icon: string;
};

export type SymbiosisFee = {
  address: string;
  chainId: number;
  chainIdFrom: number;
  decimals: number;
  symbol: string;
  icon: string;
  amount: string;
};

export type SymbiosisTokenAmount = {
  address: string;
  chainId: number;
  chainIdFrom: number;
  decimals: number;
  symbol: string;
  icon: string;
  amount: string;
};

export type SymbiosisRoute = {
  address: string;
  chainId: number;
  chainIdFrom: number;
  decimals: number;
  symbol: string;
  icon: string;
};
