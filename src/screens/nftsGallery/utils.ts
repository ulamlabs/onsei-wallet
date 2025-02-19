import { CollectionInfo, NFTInfo, TokenAttribute } from "@/modules/nfts/api";
import { useAccountsStore, useSettingsStore } from "@/store";
import { useNFTsGalleryStore } from "@/store/nftsGallery";

export type Collection = CollectionInfo & {
  nfts: NFTInfo[];
  firstNftImage: string | null;
};

export const UNKNOWN_COLLECTION_ADDRESS = "Uncategorized";

export function mapAttributesFromObject(
  attributes: Record<string, string> | TokenAttribute[] | null | undefined,
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

export function formatTokenId(tokenId: string) {
  return `#${tokenId}`;
}

export function getNFTImage(nft: NFTInfo): string | null {
  return nft.tokenMetadata.image || nft.info.extension?.image;
}

export function getNFTName(nft: NFTInfo): string | null {
  return nft.tokenMetadata.name || nft.info.extension?.name;
}

export function getNFTAttributes(nft: NFTInfo): TokenAttribute[] {
  return mapAttributesFromObject(
    nft.tokenMetadata.attributes || nft.info.extension?.attributes,
  );
}

export function getNFTDescription(nft: NFTInfo): string | null {
  return nft.tokenMetadata.description || nft.info.extension?.description;
}

export function filterNFTs(
  nfts: NFTInfo[],
  searchQuery?: string,
  customFilter?: (nft: NFTInfo) => boolean,
) {
  return nfts.filter((nft) => {
    if (customFilter && !customFilter(nft)) {
      return false;
    }

    if (!searchQuery) {
      return true;
    }

    const query = searchQuery.toLowerCase();
    const name = getNFTName(nft);
    const attributes = getNFTAttributes(nft);

    const matchesName = name?.toLowerCase().includes(query);

    let matchesCollection = false;
    if (
      nft.collection.contractAddress.toLowerCase().includes(query) ||
      UNKNOWN_COLLECTION_ADDRESS.toLowerCase().includes(query) ||
      nft.collection.name.toLowerCase().includes(query)
    ) {
      matchesCollection = true;
    }

    const matchesAttributes = attributes?.some(
      (attribute) =>
        attribute.value?.toLowerCase().includes(query) ||
        attribute.trait_type.toLowerCase().includes(query),
    );

    return matchesName || matchesCollection || matchesAttributes;
  });
}

export function groupNFTsByCollection(nfts: NFTInfo[]): Collection[] {
  const grouped = nfts.reduce<Record<string, typeof nfts>>((acc, nft) => {
    const collectionAddress =
      nft.collection.contractAddress || UNKNOWN_COLLECTION_ADDRESS;
    if (!acc[collectionAddress]) {
      acc[collectionAddress] = [];
    }
    acc[collectionAddress].push(nft);
    return acc;
  }, {});

  return Object.entries(grouped).map(([address, nfts]) => {
    const images = nfts.filter((nft) => getNFTImage(nft));

    const firstNftImage = images.length > 0 ? getNFTImage(images[0]) : null;
    const collectionInfo = nfts.find(
      (nft) => nft.collection.contractAddress === address,
    )?.collection;

    if (!collectionInfo) {
      return {
        contractAddress: address,
        name: "Unknown Collection",
        symbol: "Unknown",
        nfts,
        firstNftImage,
      };
    }

    return {
      ...collectionInfo,
      nfts,
      firstNftImage,
    };
  });
}

export function useFilterHiddenNFTs() {
  const { isNFTHidden } = useNFTsGalleryStore();
  const { activeAccount } = useAccountsStore();

  const filterHiddenNFTs = (nft: NFTInfo) => {
    if (activeAccount?.address && isNFTHidden(nft, activeAccount.address)) {
      return false;
    }
    return true;
  };

  return filterHiddenNFTs;
}
