import { TokenAttribute } from "@/modules/nfts/api";
import { useSettingsStore } from "@/store";

export function mapAttributesFromObject(
  attributes: Record<string, string> | TokenAttribute[] | null,
) {
  if (!attributes) {
    return [];
  }
  if (Array.isArray(attributes)) {
    return attributes;
  }
  return Object.entries(attributes).map<TokenAttribute>(
    ([trait_type, value]) => ({
      trait_type,
      value,
    }),
  );
}

export function formatNFTName(name: string | null | undefined) {
  if (name === undefined) {
    return "NFT name unavailable";
  }
  if (name?.trim() === "" || name === null) {
    return "Untitled NFT";
  }
  return name.trim();
}

export function getExplorerBaseUrl() {
  const { node } = useSettingsStore.getState().settings;
  return node === "TestNet" ? "testnet.seistream.app" : "seistream.app";
}

export function getTokenExplorerURL(collectionAddress: string) {
  const baseUrl = getExplorerBaseUrl();
  return `https://${baseUrl}/tokens/${collectionAddress}?tab=transfers`;
}

export function getAccountExplorerURL(accountAddress: string) {
  const baseUrl = getExplorerBaseUrl();
  return `https://${baseUrl}/account/${accountAddress}`;
}
