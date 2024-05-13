import { CosmToken } from "@/services/cosmos";

export function toIntAmount(token: CosmToken, amount: string): string {
  if (!amount) {
    return "0";
  }
  return Math.round(Number(amount) * 10 ** token.decimals).toString();
}
