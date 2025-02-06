import { SafeLayout } from "@/components";
import DashboardHeader from "@/navigation/header/DashboardHeader";
import DefaultHeaderTitle from "@/navigation/header/DefaultHeaderTitle";
import { useAccountsStore } from "@/store";
import React from "react";
import EmptyNFTsGallery from "./EmptyNFTsGallery";
import LoadingNFTsGallery from "./LoadingNFTsGallery";
import NFTsGalleryList from "./NFTsGalleryList";
import { useNFTs } from "@/modules/nfts/api";
import ErrorNFTsGallery from "./ErrorNFTsGallery";

export default function NFTsGallery() {
  const { activeAccount } = useAccountsStore();
  const nftsCollection = useNFTs(activeAccount?.address);

  return (
    <>
      <DashboardHeader>
        <DefaultHeaderTitle title="NFT Collections" />
      </DashboardHeader>
      <SafeLayout refreshFn={nftsCollection.refetch}>
        {nftsCollection.isLoading && <LoadingNFTsGallery />}
        {nftsCollection.isError && <ErrorNFTsGallery />}
        {nftsCollection.isSuccess && nftsCollection.data?.length === 0 && (
          <EmptyNFTsGallery />
        )}
        {nftsCollection.isSuccess && nftsCollection.data?.length > 0 && (
          <NFTsGalleryList nfts={nftsCollection.data} />
        )}
      </SafeLayout>
    </>
  );
}
