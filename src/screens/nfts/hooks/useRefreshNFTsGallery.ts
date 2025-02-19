import { useNFTs } from "@/modules/nfts/api";
import { useRef } from "react";
import { useCallback } from "react";

export default function useRefreshNFTsGallery() {
  const {
    nfts,
    contractAddressesQuery,
    codesQuery,
    activeAccountCodeIdsQuery,
  } = useNFTs();
  const refreshCountRef = useRef(0);

  const refreshGallery = useCallback(() => {
    refreshCountRef.current += 1;
    nfts.refetch();
    contractAddressesQuery.refetch();
    activeAccountCodeIdsQuery.refetch();
    if (refreshCountRef.current % 2 === 0) {
      codesQuery.refetch();
    }
  }, [nfts, contractAddressesQuery, codesQuery, activeAccountCodeIdsQuery]);

  return refreshGallery;
}
