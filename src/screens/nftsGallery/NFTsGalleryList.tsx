import { NFT } from "@/modules/nfts/api";
import { FlatList, StyleSheet } from "react-native";
import NFTCard, { CARD_MARGIN } from "./NFTCard";

import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

type NFTsGalleryListProps = {
  nfts: NFT[];
};

export default function NFTsGalleryList({ nfts }: NFTsGalleryListProps) {
  const numColumns = width < 480 ? 1 : 2;

  return (
    <FlatList
      key={numColumns}
      data={nfts}
      numColumns={numColumns}
      scrollEnabled={false}
      contentContainerStyle={styles.container}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <NFTCard nft={item} numColumns={numColumns} />}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: CARD_MARGIN,
    paddingHorizontal: 0,
  },
});
