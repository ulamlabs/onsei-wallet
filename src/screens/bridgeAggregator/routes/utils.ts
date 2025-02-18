import { BridgeEnum } from "@/modules/mergedBridgeData/types";
import Decimal from "decimal.js";

export const formatAmount = (
  amount: string,
  decimals: number,
  symbol: string,
) =>
  `${new Decimal(amount)
    .div(new Decimal(10).pow(decimals))
    .toString()} ${symbol}`;

export const bridgeUrlMap: {
  [bridgeKey in BridgeEnum]: string;
} = {
  Skip: "https://ibc.fun",
  Squid: "https://app.squidrouter.com",
};

export const bridgeNameMap: {
  [bridgeKey in BridgeEnum]: string;
} = {
  Skip: "Skip",
  Squid: "Squid",
};
