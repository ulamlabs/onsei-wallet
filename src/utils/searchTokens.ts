import { CosmToken, CosmTokenWithBalance } from "@/services/cosmos";

export function searchTokens<T extends CosmToken | CosmTokenWithBalance>(
  tokens: T[],
  searchTerm: string,
): T[] {
  const termLowered = searchTerm.toLowerCase();
  return tokens.filter(
    (t) =>
      t.name.toLowerCase().includes(termLowered) ||
      t.symbol.toLowerCase().includes(termLowered),
  );
}
