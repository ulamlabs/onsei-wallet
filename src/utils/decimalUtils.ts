import Decimal from "decimal.js";

export const toLimitedDecimals = (num: string, decimals: number) => {
  const [integerPart, decimalPart] = num.split(".");
  return (
    integerPart +
    (decimalPart && decimals > 0 ? "." + decimalPart.slice(0, decimals) : "")
  );
};

export const toNormalizedAmount = (amount: string, decimals: number) =>
  new Decimal(amount).mul(new Decimal(10).pow(decimals)).toFixed();

export const fromNormalizedAmount = (amount: string, decimals: number) =>
  new Decimal(amount).div(new Decimal(10).pow(decimals)).toFixed();
