import { SafeLayout, Text } from "@/components";
import { useNFTCollection } from "@/modules/nfts/api";
import { NavigationProp, NavigatorParamsList } from "@/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View } from "react-native";
import { NFTsGalleryList } from "./NFTsGalleryList";
import { useNavigation } from "@react-navigation/native";

type NFTCollectionsScreenProps = NativeStackScreenProps<
  NavigatorParamsList,
  "NFT Collections"
>;

export default function NFTCollectionsScreen({
  route: {
    params: { collection },
  },
}: NFTCollectionsScreenProps) {
  const navigation = useNavigation<NavigationProp>();
  const collectionData = useNFTCollection(collection.contractAddress);

  return (
    <SafeLayout subScreen>
      {collectionData?.nfts.length === 0 && <EmptyNFTCollection />}
      {collectionData?.nfts && collectionData.nfts.length > 0 && (
        <NFTsGalleryList
          nfts={collectionData.nfts}
          onItemPress={(nft) => {
            navigation.navigate("NFT Details", { nft });
          }}
        />
      )}
    </SafeLayout>
  );
}

function EmptyNFTCollection() {
  return (
    <View>
      <Text>No visible NFTs in this collection</Text>
    </View>
  );
}
