import { SafeLayout, Text } from "@/components";
import DashboardHeader from "@/navigation/header/DashboardHeader";
import DefaultHeaderTitle from "@/navigation/header/DefaultHeaderTitle";
import EmptyNFTsGallery from "./EmptyNFTsGallery";
import LoadingNFTsGallery from "./LoadingNFTsGallery";
import NFTsGalleryList from "./NFTsGalleryList";
import { useNFTs } from "@/modules/nfts/api";
import ErrorNFTsGallery from "./ErrorNFTsGallery";
import useRefreshNFTsGallery from "./hooks/useRefreshNFTsGallery";
import { StyleSheet } from "react-native";

export default function NFTsGallery() {
  const refreshGallery = useRefreshNFTsGallery();

  return (
    <>
      <DashboardHeader>
        <DefaultHeaderTitle title="NFT Collections" />
      </DashboardHeader>
      <SafeLayout refreshFn={refreshGallery}>
        <NFTGalleryStates />
      </SafeLayout>
    </>
  );
}

function NFTGalleryStates() {
  const { nfts, contractAddressesQuery, codesQuery } = useNFTs();

  if (
    nfts.isLoading ||
    contractAddressesQuery.isLoading ||
    codesQuery.isLoading
  ) {
    return (
      <LoadingNFTsGallery>
        {codesQuery.isLoading && (
          <Text style={styles.loadingText}>
            Collecting data. This may take a while...
          </Text>
        )}
      </LoadingNFTsGallery>
    );
  }
  if (nfts.isError || contractAddressesQuery.isError || codesQuery.isError) {
    return <ErrorNFTsGallery />;
  }
  if (nfts.isSuccess && nfts.data?.length === 0) {
    return <EmptyNFTsGallery />;
  }
  if (nfts.isSuccess && nfts.data?.length > 0) {
    return <NFTsGalleryList nfts={nfts.data} />;
  }
}

const styles = StyleSheet.create({
  loadingText: {
    marginTop: 8,
  },
});
