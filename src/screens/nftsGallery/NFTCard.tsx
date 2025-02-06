import { Text } from "@/components";
import { NFT } from "@/modules/nfts/api";
import { View, Image, StyleSheet } from "react-native";

import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const CARD_MARGIN = 8;
const CARD_WIDTH = Math.floor((width - CARD_MARGIN * 3) / 2);

type NFTCardProps = {
  nft: NFT;
  numColumns: number;
};

export default function NFTCard({ nft, numColumns }: NFTCardProps) {
  const nftNameId = `#${nft.name.split("#")[1]}`;

  return (
    <View style={[styles.nftCard, numColumns === 1 && styles.fullWidthCard]}>
      <Image source={{ uri: nft.image }} style={styles.nftImage} />
      <View style={styles.nftInfo}>
        <Text style={styles.nftCollection}>{nft.collection}</Text>
        <Text style={styles.nftName}>{nftNameId}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nftCard: {
    width: CARD_WIDTH,
    margin: CARD_MARGIN,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    shadowColor: "#999",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nftImage: {
    width: "100%",
    height: CARD_WIDTH,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  nftInfo: {
    padding: 12,
  },
  nftName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#999",
    marginBottom: 4,
  },
  nftId: {
    fontSize: 14,
    color: "#999",
  },
  nftCollection: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  fullWidthCard: {
    width: width - CARD_MARGIN * 6,
  },
});
