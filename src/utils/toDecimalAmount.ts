import { CosmToken } from "@/services/cosmos";

export function toDecimalAmount(token: CosmToken, amount: string): string {
  return (Number(amount) / 10 ** token.decimals).toString();
}
