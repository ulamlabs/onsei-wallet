import { create } from "zustand";
import { loadFromStorage, saveToStorage } from "@/utils";
import { NFTInfo } from "@/modules/nfts/api";

type NFTsGalleryStore = {
  hiddenCollections: NFTInfo["collectionAddress"][];
  init: () => Promise<void>;
  hideCollection: (collectionAddress: NFTInfo["collectionAddress"]) => void;
  showCollection: (collectionAddress: NFTInfo["collectionAddress"]) => void;
  isCollectionHidden: (
    collectionAddress: NFTInfo["collectionAddress"],
  ) => boolean;
};

export const useNFTsGalleryStore = create<NFTsGalleryStore>((set, get) => ({
  hiddenCollections: [],
  init: async () => {
    const hiddenCollections = await loadFromStorage<
      NFTInfo["collectionAddress"][]
    >("hiddenCollections", []);
    set({ hiddenCollections });
  },
  hideCollection: (collectionAddress) => {
    set((state) => {
      const hiddenCollections = [...state.hiddenCollections, collectionAddress];
      saveToStorage("hiddenCollections", hiddenCollections);
      return { hiddenCollections };
    });
  },
  showCollection: (collectionAddress) => {
    set((state) => {
      const hiddenCollections = state.hiddenCollections.filter(
        (address) => address !== collectionAddress,
      );
      saveToStorage("hiddenCollections", hiddenCollections);
      return { hiddenCollections };
    });
  },
  isCollectionHidden: (collectionAddress) => {
    return get().hiddenCollections.includes(collectionAddress);
  },
}));
