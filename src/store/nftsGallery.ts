import { create } from "zustand";
import { loadFromStorage, saveToStorage } from "@/utils";
import { NFTInfo } from "@/modules/nfts/api";

type NFTsGalleryStore = {
  hiddenNFTs: NFTInfo["tokenId"][];
  init: () => Promise<void>;
  hideNFT: (nftId: NFTInfo["tokenId"]) => void;
  showNFT: (nftId: NFTInfo["tokenId"]) => void;
  isNFTHidden: (nftId: NFTInfo["tokenId"]) => boolean;
};

export const useNFTsGalleryStore = create<NFTsGalleryStore>((set, get) => ({
  hiddenNFTs: [],
  init: async () => {
    const hiddenNFTs = await loadFromStorage<NFTInfo["tokenId"][]>(
      "hiddenNFTs",
      [],
    );
    set({ hiddenNFTs });
  },
  hideNFT: (nftId) => {
    set((state) => {
      const hiddenNFTs = [...state.hiddenNFTs, nftId];
      saveToStorage("hiddenNFTs", hiddenNFTs);
      return { hiddenNFTs };
    });
  },
  showNFT: (nftId) => {
    set((state) => {
      const hiddenNFTs = state.hiddenNFTs.filter((id) => id !== nftId);
      saveToStorage("hiddenNFTs", hiddenNFTs);
      return { hiddenNFTs };
    });
  },
  isNFTHidden: (nftId) => {
    return get().hiddenNFTs.includes(nftId);
  },
}));
