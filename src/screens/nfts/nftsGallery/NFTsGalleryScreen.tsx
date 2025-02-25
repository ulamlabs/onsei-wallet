import { SafeLayout, Text } from "@/components";
import DashboardHeader from "@/navigation/header/DashboardHeader";
import EmptyNFTsGallery from "./EmptyNFTsGallery";
import CenteredLoader from "../../../components/CenteredLoader";
import NFTsGalleryContent from "../NFTsGalleryList";
import { useNFTs } from "@/modules/nfts/api";
import ErrorNFTsGallery from "./ErrorNFTsGallery";
import useRefreshNFTsGallery from "../hooks/useRefreshNFTsGallery";
import { StyleSheet } from "react-native";
import MoreOptions from "@/components/MoreOptions";
import { FontSizes, FontWeights } from "@/styles";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { NavigatorParamsList } from "@/types";
import { useNFTsGalleryStore } from "@/store/nftsGallery";
import { useAccountsStore } from "@/store";

type NFTsGalleryScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "NFTs"
>;
export default function NFTsGalleryScreen({
  navigation,
}: NFTsGalleryScreenProps) {
  const refreshGallery = useRefreshNFTsGallery();
  const { activeAccount } = useAccountsStore();
  const { listStates } = useNFTs();
  const { hiddenNFTs } = useNFTsGalleryStore();

  const moreOptions = [];
  if (
    listStates.isSuccess &&
    activeAccount?.address &&
    hiddenNFTs[activeAccount.address].length > 0
  ) {
    moreOptions.push({
      label: "Hidden NFTs",
      value: "hidden-nfts",
      onPress: () => navigation.navigate("Hidden NFTs"),
    });
  }

  return (
    <>
      <DashboardHeader style={styles.header}>
        <Text
          style={[{ fontSize: FontSizes.lg, fontFamily: FontWeights.bold }]}
        >
          NFT Collections
        </Text>
        <MoreOptions options={moreOptions} />
      </DashboardHeader>
      <SafeLayout refreshFn={refreshGallery}>
        <NFTGalleryStates />
      </SafeLayout>
    </>
  );
}

function NFTGalleryStates() {
  const { nfts, listStates } = useNFTs();

  if (listStates.isLoading) {
    return (
      <CenteredLoader size="big">
        {
          <Text style={styles.loadingText}>
            {listStates.isLoadingCodes
              ? "Collecting data. This may take a while..."
              : // leave white space to avoid layout shift
                "  "}
          </Text>
        }
      </CenteredLoader>
    );
  }
  if (listStates.isError) {
    return <ErrorNFTsGallery />;
  }
  if (listStates.isEmpty) {
    return <EmptyNFTsGallery />;
  }
  if (listStates.isSuccess && nfts.isSuccess) {
    return <NFTsGalleryContent nfts={nfts.data} />;
  }
  return <ErrorNFTsGallery />;
}

const styles = StyleSheet.create({
  loadingText: {
    marginTop: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
