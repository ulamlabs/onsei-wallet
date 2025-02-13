import {
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { CARD_MARGIN } from "../../components/Card";
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

const UNKNOWN_COLLECTION_ADDRESS = "Uncategorized";

type Collection = {
  address: string;
  nfts: NFTInfo[];
  firstNftImage: string | null;
};

type NFTsListProps = {
  nfts: NFTInfo[];
};

const NFTsList = ({ nfts }: NFTsListProps) => {
  return (
    <View>
      <View style={styles.collectionsHeader}>
        <View />
        <Text style={styles.collectionCount}>
          {pluralize(nfts.length, "NFT")}
        </Text>
      </View>
      <FlatList
        key="nfts"
        data={nfts}
        numColumns={2}
        scrollEnabled={false}
        contentContainerStyle={styles.container}
        keyExtractor={(item) => item.tokenId.toString()}
        renderItem={({ item }) => <NFTGalleryCard nft={item} />}
      />
    </View>
  );
};

type NFTGalleryCardProps = {
  nft: NFTInfo;
};

function NFTGalleryCard({ nft }: NFTGalleryCardProps) {
  const navigation = useNavigation<NavigationProp>();
  const image = nft.tokenMetadata?.image || nft.info.extension?.image || null;
  const collection = useCollectionInfo(nft.collectionAddress);
  const title =
    nft.collectionAddress === UNKNOWN_COLLECTION_ADDRESS
      ? "Uncategorized"
      : collection.data?.name || "Name unavailable";

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("NFTDetails", { nft })}
    >
      <Card
        image={image}
        title={title}
        subtitle={`#${nft.tokenId}`}
        imageStyle={{
          height: Dimensions.get("window").width / 2 - CARD_MARGIN * 4,
        }}
      />
    </TouchableOpacity>
  );
}

type CollectionsListProps = {
  collections: Collection[];
};

const CollectionsList = ({ collections }: CollectionsListProps) => {
  return (
    <View>
      <View style={styles.collectionsHeader}>
        <View />
        <Text style={styles.collectionCount}>
          {pluralize(collections.length, "Collection")}
        </Text>
      </View>
      <FlatList
        key="collections"
        data={collections}
        numColumns={2}
        scrollEnabled={false}
        contentContainerStyle={styles.container}
        keyExtractor={(item) => item.address}
        renderItem={({ item }) => <CollectionCard collection={item} />}
      />
    </View>
  );
};

type CollectionCardProps = {
  collection: Collection;
};

function CollectionCard({ collection }: CollectionCardProps) {
  const collectionInfo = useCollectionInfo(collection.address);

  return (
    <Card
      image={collection.firstNftImage}
      title={collectionInfo.data?.name || "Name unavailable"}
      subtitle={pluralize(collection.nfts.length, "NFT")}
      imageStyle={{
        height: Dimensions.get("window").width / 2 - CARD_MARGIN * 4,
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
        containerStyle={{
          marginBottom: CARD_MARGIN,
          paddingHorizontal: CARD_MARGIN,
        }}
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
            All
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
        <NFTsList nfts={filteredNFTs} />
      ) : (
        <CollectionsList collections={collections} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: CARD_MARGIN,
    paddingHorizontal: 0,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: CARD_MARGIN,
    marginBottom: 8,
    marginTop: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilter: {
    backgroundColor: "#fff",
  },
  filterText: {
    color: "#999",
    fontSize: 14,
  },
  activeFilterText: {
    color: "#000",
  },
  collectionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: CARD_MARGIN,
    marginBottom: 12,
  },
  seiTag: {
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
  },
  seiTagText: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  collectionCount: {
    fontSize: 14,
  },
});
