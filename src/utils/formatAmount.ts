function cutTrailingZeros(amount: string): string {
  while (amount.endsWith("0")) {
    amount = amount.slice(0, amount.length - 1);
  }
  return amount;
}

type FormatAmountOptions = {
  noDecimalSeparator?: boolean;
};

export function formatAmount(
  amount: bigint,
  decimals: number,
  options?: FormatAmountOptions,
): string {
  if (decimals === 0) {
    if (!options?.noDecimalSeparator) {
      return formatDecimalSeparator(amount.toString());
    }
    return amount.toString();
  }

  const magnitude = 10n ** BigInt(decimals);
  const sAmount = amount.toString();
  if (amount < magnitude) {
    if (amount === 0n) {
      return "0";
    }
    const fraction = cutTrailingZeros(sAmount.padStart(decimals, "0"));
    return `0.${fraction}`;
  }

  let whole = sAmount.slice(0, sAmount.length - decimals);
  if (!options?.noDecimalSeparator) {
    whole = formatDecimalSeparator(whole);
  }
  const fraction = cutTrailingZeros(sAmount.slice(sAmount.length - decimals));
  if (fraction) {
    return `${whole}.${fraction}`;
  }

  return whole;
}

export function formatDecimalSeparator(whole: string): string {
  let result = "";
  let digits = 0;
  for (let i = whole.length - 1; i >= 0; i--) {
    result = whole[i] + result;
    if (++digits % 3 === 0 && i > 0) {
      result = "," + result;
    }
  }
  return result;
}

export function parseAmount(amount: string, decimals: number): bigint {
  if (!amount) {
    return 0n;
  }

  const magnitude = 10n ** BigInt(decimals);

  if (!amount.includes(".")) {
    return BigInt(amount) * magnitude;
  }

  const [whole, fraction] = amount.split(".");
  return BigInt(whole) * magnitude + BigInt(fraction.padEnd(decimals, "0"));
}
