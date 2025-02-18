import { get } from "./baseApi";

const url = "/route";

export type SquidRoutePayload = {
  // customContractCalls: unknown[]; // TODO: type from Squid docs when necessary
  enableExpress?: boolean;
  fromAddress: string;
  fromAmount: string;
  fromChain: string;
  fromToken: string;
  // prefer?: string[];
  quoteOnly?: boolean;
  receiveGasOnDestination?: boolean;
  slippage: string;
  toAddress?: string;
  toChain: string;
  toToken: string;
};

export type SquidRouteResponse = {
  route: SquidRoute;
};

export type SquidRouteError = {
  error: string;
  message: string;
  errorType: string;
};

export type SquidRoute = {
  estimate: {
    aggregatePriceImpact: string;
    estimatedRouteDuration: number;
    exchangeRate: string;
    feeCosts: unknown[]; // TODO
    fromAmount: string;
    fromAmountUSD: string;
    gasCosts: unknown[];
    route: unknown[]; // TODO
    sendAmount: string;
    toAmount: string;
    toAmountMin: string;
    toAmountUSD: string;
    toAmountMinUSD: string;
  };
  params: unknown; // TODO: type from Squid docs when necessary
  transactionRequest: unknown; // TODO: type from Squid docs when necessary
};

export const getRoute = (payload: SquidRoutePayload) =>
  get<SquidRouteResponse, SquidRoutePayload>(url, payload);
