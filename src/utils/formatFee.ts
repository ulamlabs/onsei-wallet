import { CosmTokenWithBalance } from "@/services/cosmos";
import { formatAmount } from "./formatAmount";

export function formatFee(feeInt: bigint, token: CosmTokenWithBalance) {
  const usdFee = +formatAmount(feeInt, token.decimals).replaceAll(",", "");
  const displayedFee = token.price
    ? token.price * usdFee < 0.01
      ? `<$0.01`
      : `$${usdFee.toFixed(2)}`
    : `${formatAmount(feeInt, token.decimals)} ${token.symbol}`;
  return displayedFee;
}
