import { create } from "zustand";
import { loadFromStorage, saveToStorage } from "@/utils";
import { NFTInfo } from "@/modules/nfts/api";
import { Account } from "./account";

export type NFTKey =
  `${NFTInfo["collection"]["contractAddress"]}:${NFTInfo["tokenId"]}`;

function getNFTKey(nft: NFTInfo): NFTKey {
  return `${nft.collection.contractAddress}:${nft.tokenId}`;
}

type NFTsGalleryStore = {
  hiddenNFTs: Record<Account["address"], NFTKey[]>;
  init: () => Promise<void>;
  hideNFT: (nft: NFTInfo, accountAddress: Account["address"]) => void;
  showNFT: (nft: NFTInfo, accountAddress: Account["address"]) => void;
  isNFTHidden: (nft: NFTInfo, accountAddress: Account["address"]) => boolean;
};

export const useNFTsGalleryStore = create<NFTsGalleryStore>((set, get) => ({
  hiddenNFTs: {},
  init: async () => {
    const hiddenNFTs = await loadFromStorage<Record<string, NFTKey[]>>(
      "hiddenNFTs",
      {},
    );
    set({ hiddenNFTs });
  },
  hideNFT: (nft, accountAddress) => {
    set((state) => {
      const accountHiddenNFTs = state.hiddenNFTs[accountAddress] || [];
      const updatedHiddenNFTs = {
        ...state.hiddenNFTs,
        [accountAddress]: [...accountHiddenNFTs, getNFTKey(nft)],
      };
      saveToStorage("hiddenNFTs", updatedHiddenNFTs);
      return { hiddenNFTs: updatedHiddenNFTs };
    });
  },
  showNFT: (nft, accountAddress) => {
    set((state) => {
      const accountHiddenNFTs = state.hiddenNFTs[accountAddress] || [];
      const updatedAccountNFTs = accountHiddenNFTs.filter(
        (nftKey) => nftKey !== getNFTKey(nft),
      );
      const updatedHiddenNFTs = {
        ...state.hiddenNFTs,
        [accountAddress]: updatedAccountNFTs,
      };
      saveToStorage("hiddenNFTs", updatedHiddenNFTs);
      return { hiddenNFTs: updatedHiddenNFTs };
    });
  },
  isNFTHidden: (nft, accountAddress) => {
    const accountHiddenNFTs = get().hiddenNFTs[accountAddress] || [];
    return accountHiddenNFTs.includes(getNFTKey(nft));
  },
}));
