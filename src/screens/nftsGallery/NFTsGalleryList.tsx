import { NFT } from "@/modules/nfts/api";
import { FlatList, StyleSheet, View, TouchableOpacity } from "react-native";
import { CARD_MARGIN } from "../../components/Card";
import { Text } from "@/components";
import React from "react";

import { Dimensions } from "react-native";
import Card from "../../components/Card";
import pluralize from "@/utils/pluralize";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@/types";

const { width } = Dimensions.get("window");

type NFTsGalleryListProps = {
  nfts: NFT[];
};

type Collection = {
  name: string;
  nfts: NFT[];
  firstNftImage: string;
};

type NFTsListProps = {
  nfts: NFT[];
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
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("NFTDetails", { nft: item })}
          >
            <Card
              image={item.image}
              title={item.collection || "Uncategorized"}
              subtitle={`#${item.name.split("#")[1]}`}
              numColumns={numColumns}
            />
          </TouchableOpacity>
        )}
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

export default function NFTsGalleryList({ nfts }: NFTsGalleryListProps) {
  const [activeFilter, setActiveFilter] = React.useState<"all" | "collections">(
    "all",
  );
  const numColumns = width < 480 ? 1 : 2;

  const collections = React.useMemo(() => {
    const grouped = nfts.reduce((acc: { [key: string]: NFT[] }, nft) => {
      const collectionName = nft.collection || "Uncategorized";
      if (!acc[collectionName]) {
        acc[collectionName] = [];
      }
      acc[collectionName].push(nft);
      return acc;
    }, {});

    return Object.entries(grouped).map(
      ([name, nfts]): Collection => ({
        name,
        nfts,
        firstNftImage: nfts[0]?.image || "",
      }),
    );
  }, [nfts]);

  return (
    <View>
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
        <NFTsList nfts={nfts} numColumns={numColumns} />
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
    marginBottom: CARD_MARGIN,
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
