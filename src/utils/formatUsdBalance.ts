export const formatUsdBalance = (balance: number) => {
  const formattedAmount = balance.toFixed(2);

  return formattedAmount.endsWith(".00")
    ? +balance.toFixed(0)
    : +formattedAmount;
};
