import { CosmToken } from "@/services/cosmos";

export function searchTokens(
  tokens: CosmToken[],
  searchTerm: string,
): CosmToken[] {
  const termLowered = searchTerm.toLowerCase();
  return tokens.filter(
    (t) =>
      t.name.toLowerCase().includes(termLowered) ||
      t.symbol.toLowerCase().includes(termLowered),
  );
}
