import { post } from "./baseApi";
import {
  SymbiosisFee,
  SymbiosisRoute,
  SymbiosisToken,
  SymbiosisTokenAmount,
} from "./types";

export type SymbiosisSwapPayload = {
  tokenAmountIn: {
    address: string;
    amount: string;
    chainId: number;
    decimals: number;
  };
  tokenOut: {
    address: string;
    symbol: string;
    chainId: number;
    decimals: number;
  };
  from: string;
  to: string;
  slippage: number;
  revertableAddresses?: {
    chainIn: number;
    address: string;
  };
  selectMode: "best_return" | "fastest";
};

export type SymbiosisSwapResponse = {
  tx: {
    chainId: number;
    to: string;
    data: string;
    value: string;
  };
  fee: SymbiosisFee;
  fees: [
    {
      provider: string;
      value: SymbiosisFee;
      save: SymbiosisFee;
      description: string;
    },
  ];
  route: SymbiosisRoute[];
  routes: [
    {
      provider: string;
      tokens: SymbiosisToken[];
    },
  ];
  priceImpact: string;
  tokenAmountOut: SymbiosisTokenAmount;
  tokenAmountOutMin: SymbiosisTokenAmount;
  amountInUsd: SymbiosisTokenAmount;
  rewards: SymbiosisTokenAmount[];
  approveTo: string;
  inTradeType: string;
  outTradeType: string;
  type: string;
  kind: string;
  estimatedTime: number;
};

const url = "/v1/swap";

export const postSwap = (payload: SymbiosisSwapPayload) =>
  post<SymbiosisSwapResponse, SymbiosisSwapPayload>(url, payload);
