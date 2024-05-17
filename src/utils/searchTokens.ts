import { CosmTokenWithBalance } from "@/services/cosmos";

export function searchTokens(
  tokens: CosmTokenWithBalance[],
  searchTerm: string,
): CosmTokenWithBalance[] {
  const termLowered = searchTerm.toLowerCase();
  return tokens.filter(
    (t) =>
      t.name.toLowerCase().includes(termLowered) ||
      t.symbol.toLowerCase().includes(termLowered),
  );
}
