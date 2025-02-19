import { SafeLayout, Text } from "@/components";
import { NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { NFTsGalleryList } from "../NFTsGalleryList";
import { useNFTs } from "@/modules/nfts/api";
import { useNFTsGalleryStore } from "@/store/nftsGallery";
import { View } from "react-native";
import { useAccountsStore } from "@/store";

type HiddenNFTsScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "Hidden NFTs"
>;

export default function HiddenNFTsScreen({
  navigation,
}: HiddenNFTsScreenProps) {
  const { isNFTHidden } = useNFTsGalleryStore();
  const { nfts } = useNFTs();
  const { activeAccount } = useAccountsStore();
  const hiddenNFTs =
    nfts.data?.filter(
      (nft) =>
        activeAccount?.address && isNFTHidden(nft, activeAccount.address),
    ) ?? [];

  return (
    <SafeLayout subScreen>
      {hiddenNFTs.length === 0 && <EmptyHiddenNFTsGallery />}
      {hiddenNFTs.length > 0 && (
        <NFTsGalleryList
          nfts={hiddenNFTs}
          onItemPress={(nft) => {
            navigation.navigate("NFT Details", { nft });
          }}
        />
      )}
    </SafeLayout>
  );
}

function EmptyHiddenNFTsGallery() {
  return (
    <View>
      <Text>No hidden NFTs</Text>
    </View>
  );
}
