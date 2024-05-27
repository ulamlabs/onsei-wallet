export const formatUsdBalance = (balance: number) => {
  const formattedAmount = balance.toFixed(2);
  return +formattedAmount;
};
