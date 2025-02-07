import { create } from "zustand";
import { loadFromStorage, saveToStorage } from "@/utils";
import { NFT } from "@/modules/nfts/api";

type NFTGalleryStore = {
  hiddenNFTs: NFT["id"][];
  init: () => Promise<void>;
  hideNFT: (nftId: NFT["id"]) => void;
  showNFT: (nftId: NFT["id"]) => void;
  isNFTHidden: (nftId: NFT["id"]) => boolean;
};

export const useNFTGalleryStore = create<NFTGalleryStore>((set, get) => ({
  hiddenNFTs: [],
  init: async () => {
    const hiddenNFTs = await loadFromStorage<NFT["id"][]>("hiddenNFTs", []);
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
