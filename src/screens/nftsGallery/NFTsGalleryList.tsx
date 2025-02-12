import { FlatList, StyleSheet, View, TouchableOpacity } from "react-native";
import { CARD_MARGIN } from "../../components/Card";
import { Text } from "@/components";
import React, { useMemo, useState } from "react";

import { Dimensions } from "react-native";
import Card from "../../components/Card";
import pluralize from "@/utils/pluralize";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@/types";
import SearchInput from "@/components/forms/SearchInput";
import { useNFTsGalleryStore } from "@/store/nftsGallery";
import { NFTInfo } from "@/modules/nfts/api";
import { mapAttributesFromObject } from "./utils";

const { width } = Dimensions.get("window");

type Collection = {
  name: string;
  nfts: NFTInfo[];
  firstNftImage: string | null;
};

type NFTsListProps = {
  nfts: NFTInfo[];
  numColumns: number;
};

const NFTsList = ({ nfts, numColumns }: NFTsListProps) => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View>
      <View style={styles.collectionsHeader}>
        <View />
        <Text style={styles.collectionCount}>
          {pluralize(nfts.length, "NFT")}
        </Text>
      </View>
      <FlatList
        key={`${numColumns}-nfts`}
        data={nfts}
        numColumns={numColumns}
        scrollEnabled={false}
        contentContainerStyle={styles.container}
        keyExtractor={(item) => item.tokenId.toString()}
        renderItem={({ item }) => {
          const image = item.tokenMetadata.image || item.info.extension?.image;

          return (
            <TouchableOpacity
              onPress={() => navigation.navigate("NFTDetails", { nft: item })}
            >
              <Card
                image={image}
                title={item.collection?.name || "Name unavailable"}
                subtitle={`#${item.tokenId}`}
                numColumns={numColumns}
              />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const CollectionsList = ({
  collections,
  numColumns,
}: {
  collections: Collection[];
  numColumns: number;
}) => (
  <View>
    <View style={styles.collectionsHeader}>
      <View />
      <Text style={styles.collectionCount}>
        {pluralize(collections.length, "Collection")}
      </Text>
    </View>
    <FlatList
      key={`${numColumns}-collections`}
      data={collections}
      numColumns={numColumns}
      scrollEnabled={false}
      contentContainerStyle={styles.container}
      keyExtractor={(item) => item.name}
      renderItem={({ item }) => (
        <Card
          image={item.firstNftImage}
          title={item.name}
          subtitle={pluralize(item.nfts.length, "NFT")}
          numColumns={numColumns}
        />
      )}
    />
  </View>
);

type NFTsGalleryListProps = {
  nfts: NFTInfo[];
};
export default function NFTsGalleryList({ nfts }: NFTsGalleryListProps) {
  const { isNFTHidden, hiddenNFTs } = useNFTsGalleryStore();
  const [activeFilter, setActiveFilter] = useState<"all" | "collections">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const numColumns = width < 480 ? 1 : 2;

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
      const matchesCollection = (nft.collection?.name || "Uncategorized")
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

  const collections = useMemo(() => {
    const grouped = filteredNFTs.reduce<Record<string, typeof filteredNFTs>>(
      (acc, nft) => {
        const collectionName = nft.collection?.name || "Uncategorized";
        if (!acc[collectionName]) {
          acc[collectionName] = [];
        }
        acc[collectionName].push(nft);
        return acc;
      },
      {},
    );

    return Object.entries(grouped).map(([name, nfts]) => {
      const images = nfts.filter(
        (nft) =>
          !isNFTHidden(nft.tokenId) &&
          (nft.tokenMetadata.image || nft.info.extension?.image),
      );

      const firstNftImage =
        images[0]?.tokenMetadata.image || images[0]?.info.extension?.image;

      return {
        name,
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
        <NFTsList nfts={filteredNFTs} numColumns={numColumns} />
      ) : (
        <CollectionsList collections={collections} numColumns={numColumns} />
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
