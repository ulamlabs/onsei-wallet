import { SafeLayout, Text } from "@/components";
import DashboardHeader from "@/navigation/header/DashboardHeader";
import DefaultHeaderTitle from "@/navigation/header/DefaultHeaderTitle";
import EmptyNFTsGallery from "./EmptyNFTsGallery";
import CenteredLoader from "../../components/CenteredLoader";
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
  const {
    nfts,
    contractAddressesQuery,
    codesQuery,
    activeAccountCodeIdsQuery,
  } = useNFTs();

  const isLoadingCodes =
    codesQuery.isLoading &&
    !activeAccountCodeIdsQuery.isLoading &&
    !activeAccountCodeIdsQuery.data?.length;

  if (
    nfts.isLoading ||
    contractAddressesQuery.isLoading ||
    activeAccountCodeIdsQuery.isLoading ||
    isLoadingCodes
  ) {
    return (
      <CenteredLoader size="big">
        {
          <Text style={styles.loadingText}>
            {isLoadingCodes
              ? "Collecting data. This may take a while..."
              : // leave white space to avoid layout shift
                "  "}
          </Text>
        }
      </CenteredLoader>
    );
  }
  if (
    nfts.isError ||
    contractAddressesQuery.isError ||
    codesQuery.isError ||
    activeAccountCodeIdsQuery.isError
  ) {
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
