import { create } from "zustand";
import { loadFromStorage, saveToStorage } from "@/utils";
import { NFTInfo } from "@/modules/nfts/api";

export type NFTKey = `${NFTInfo["collectionAddress"]}:${NFTInfo["tokenId"]}`;

function getNFTKey(nft: NFTInfo): NFTKey {
  return `${nft.collectionAddress}:${nft.tokenId}`;
}

type NFTsGalleryStore = {
  hiddenNFTs: NFTKey[];
  init: () => Promise<void>;
  hideNFT: (nft: NFTInfo) => void;
  showNFT: (nft: NFTInfo) => void;
  isNFTHidden: (nft: NFTInfo) => boolean;
};

export const useNFTsGalleryStore = create<NFTsGalleryStore>((set, get) => ({
  hiddenNFTs: [],
  init: async () => {
    const hiddenNFTs = await loadFromStorage<NFTKey[]>("hiddenNFTs", []);
    set({ hiddenNFTs });
  },
  hideNFT: (nft) => {
    set((state) => {
      const hiddenNFTs = [...state.hiddenNFTs, getNFTKey(nft)];
      saveToStorage("hiddenNFTs", hiddenNFTs);
      return { hiddenNFTs };
    });
  },
  showNFT: (nft) => {
    set((state) => {
      const hiddenNFTs = state.hiddenNFTs.filter(
        (nftKey) => nftKey !== getNFTKey(nft),
      );
      saveToStorage("hiddenNFTs", hiddenNFTs);
      return { hiddenNFTs };
    });
  },
  isNFTHidden: (nft) => {
    return get().hiddenNFTs.includes(getNFTKey(nft));
  },
}));
