import {
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Text } from "@/components";
import React, { useMemo, useState } from "react";
import Card from "../../components/Card";
import pluralize from "@/utils/pluralize";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@/types";
import SearchInput from "@/components/forms/SearchInput";
import { useNFTsGalleryStore } from "@/store/nftsGallery";
import { NFTInfo, useCollectionInfo } from "@/modules/nfts/api";
import { mapAttributesFromObject } from "./utils";
import { Colors, FontSizes, FontWeights } from "@/styles";
import { APP_HORIZONTAL_PADDING } from "@/const";

const UNKNOWN_COLLECTION_ADDRESS = "Uncategorized";

type Collection = {
  address: string;
  nfts: NFTInfo[];
  firstNftImage: string | null;
};

function formatCollectionName(
  collectionAddress: string,
  collectionName: string | undefined,
) {
  return collectionAddress === UNKNOWN_COLLECTION_ADDRESS
    ? "Uncategorized"
    : collectionName || "Unknown collection";
}

function formatTokenId(tokenId: string) {
  return `#${tokenId}`;
}

function formatAllFilterTag(count: number) {
  return `All (${count})`;
}

type NFTGalleryCardProps = {
  nft: NFTInfo;
};

const CARDS_GAP = 16;
const cardSize =
  (Dimensions.get("window").width - CARDS_GAP - 2 * APP_HORIZONTAL_PADDING) / 2;

function NFTGalleryCard({ nft }: NFTGalleryCardProps) {
  const navigation = useNavigation<NavigationProp>();
  const image = nft.tokenMetadata?.image || nft.info.extension?.image || null;
  const collection = useCollectionInfo(nft.collectionAddress);

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("NFTDetails", { nft })}
    >
      <Card
        imageSrc={image}
        title={formatCollectionName(
          nft.collectionAddress,
          collection.data?.name,
        )}
        subtitle={formatTokenId(nft.tokenId)}
        imageStyle={{
          height: cardSize,
          borderRadius: 18,
        }}
      />
    </TouchableOpacity>
  );
}

type CollectionCardProps = {
  collection: Collection;
};

function CollectionCard({ collection }: CollectionCardProps) {
  const collectionInfo = useCollectionInfo(collection.address);

  return (
    <Card
      imageSrc={collection.firstNftImage}
      title={formatCollectionName(
        collection.address,
        collectionInfo.data?.name,
      )}
      subtitle={pluralize(collection.nfts.length, "NFT")}
      imageStyle={{
        height: cardSize,
        borderRadius: 18,
      }}
    />
  );
}

type NFTsGalleryListProps = {
  nfts: NFTInfo[];
};
export default function NFTsGalleryList({ nfts }: NFTsGalleryListProps) {
  const { isNFTHidden, hiddenNFTs } = useNFTsGalleryStore();
  const [activeFilter, setActiveFilter] = useState<"all" | "collections">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNFTs = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return nfts.filter((nft) => {
      if (isNFTHidden(nft.tokenId)) {
        return false;
      }
      const name = nft.tokenMetadata.name || nft.info.extension?.name;
      const attributes = mapAttributesFromObject(
        nft.tokenMetadata.attributes || nft.info.extension?.attributes,
      );

      const matchesName = name?.toLowerCase().includes(query);
      const matchesCollection = (
        nft.collectionAddress || UNKNOWN_COLLECTION_ADDRESS
      )
        .toLowerCase()
        .includes(query);
      const matchesAttributes = attributes?.some(
        (attribute) =>
          attribute.value?.toLowerCase().includes(query) ||
          attribute.trait_type.toLowerCase().includes(query),
      );

      return matchesName || matchesCollection || matchesAttributes;
    });
  }, [nfts, searchQuery, isNFTHidden, hiddenNFTs]);

  const collections: Collection[] = useMemo(() => {
    const grouped = filteredNFTs.reduce<Record<string, typeof filteredNFTs>>(
      (acc, nft) => {
        const collectionAddress =
          nft.collectionAddress || UNKNOWN_COLLECTION_ADDRESS;
        if (!acc[collectionAddress]) {
          acc[collectionAddress] = [];
        }
        acc[collectionAddress].push(nft);
        return acc;
      },
      {},
    );

    return Object.entries(grouped).map(([address, nfts]) => {
      const images = nfts.filter(
        (nft) =>
          !isNFTHidden(nft.tokenId) &&
          (nft.tokenMetadata.image || nft.info.extension?.image),
      );

      const firstNftImage =
        images[0]?.tokenMetadata.image || images[0]?.info.extension?.image;

      return {
        address,
        nfts,
        firstNftImage,
      };
    });
  }, [filteredNFTs]);

  return (
    <View>
      <SearchInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search NFTs, collections, attributes..."
      />

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === "all" && styles.activeFilter,
          ]}
          onPress={() => setActiveFilter("all")}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === "all" && styles.activeFilterText,
            ]}
          >
            {formatAllFilterTag(filteredNFTs.length)}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === "collections" && styles.activeFilter,
          ]}
          onPress={() => setActiveFilter("collections")}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === "collections" && styles.activeFilterText,
            ]}
          >
            Collections
          </Text>
        </TouchableOpacity>
      </View>

      {activeFilter === "all" ? (
        <FlatList
          key="nfts"
          data={filteredNFTs}
          numColumns={2}
          scrollEnabled={false}
          contentContainerStyle={styles.flatList}
          keyExtractor={(item) => item.tokenId}
          renderItem={({ item }) => <NFTGalleryCard nft={item} />}
          columnWrapperStyle={styles.columnWrapper}
        />
      ) : (
        <FlatList
          key="collections"
          data={collections}
          numColumns={2}
          scrollEnabled={false}
          contentContainerStyle={styles.flatList}
          keyExtractor={(item) => item.address}
          renderItem={({ item }) => <CollectionCard collection={item} />}
          columnWrapperStyle={styles.columnWrapper}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  filterContainer: {
    flexDirection: "row",
    marginTop: 32,
    gap: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: Colors.background,
    borderColor: Colors.inputBorderColor,
    borderWidth: 1,
  },
  activeFilter: {
    borderColor: Colors.markerBackground,
  },
  filterText: {
    color: Colors.text100,
    fontFamily: FontWeights.regular,
    fontSize: FontSizes.sm,
    letterSpacing: 0,
    lineHeight: 21,
  },
  activeFilterText: {
    color: Colors.text,
  },
  flatList: {
    gap: CARDS_GAP,
    marginTop: 32,
  },
  columnWrapper: {
    gap: CARDS_GAP,
  },
});
